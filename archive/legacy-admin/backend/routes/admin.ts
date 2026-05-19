import express from "express";
import { memoryStore, db } from "../data/store";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/users", async (req, res) => {
  if (db) {
    const users = await db.collection("users").find({ role: 'user' }).toArray();
    res.json(users.map((u: any) => ({ ...u, id: u.id || u._id.toString() })));
  } else {
    res.json(memoryStore.users.filter(u => u.role === 'user'));
  }
});

router.get("/drivers", async (req, res) => {
  if (db) {
     const drivers = await db.collection("users").find({ role: 'driver' }).toArray();
     res.json(drivers.map((d: any) => ({ ...d, id: d.id || d._id.toString() })));
  } else {
     res.json(memoryStore.users.filter(u => u.role === 'driver'));
  }
});

router.post("/drivers/:id", async (req, res) => {
  const driverId = req.params.id;
  const updateData = req.body;

  if (db) {
    try {
      const { id, ...dataToUpdate } = updateData;
      await db.collection("users").updateOne(
        { _id: new ObjectId(driverId) },
        { $set: dataToUpdate }
      );
    } catch (e) {
      await db.collection("users").updateOne(
        { id: driverId },
        { $set: updateData }
      );
    }
  } else {
    const driverIndex = memoryStore.users.findIndex(u => u.id === driverId);
    if (driverIndex !== -1) {
      memoryStore.users[driverIndex] = { ...memoryStore.users[driverIndex], ...updateData };
    }
  }
  res.json({ success: true });
});

router.get("/kyc", async (req, res) => {
  if (db) {
    const kycList = await db.collection("kyc").find().toArray();
    res.json(kycList);
  } else {
    const list = Object.entries(memoryStore.kyc).map(([userId, status]: [string, any]) => {
      const user = memoryStore.users.find(u => u.id === userId);
      return {
        userId,
        userName: user?.name,
        ...status
      };
    });
    res.json(list);
  }
});

router.post("/kyc/verify", async (req, res) => {
  const { userId, type, status } = req.body;
  
  if (db) {
    if (type === 'all') {
      const isVerified = status === 'verified';
      await db.collection("kyc").updateOne(
        { userId },
        { $set: { isVerified, vehicle: status, pan: status, aadhaar: status, photo: status } }
      );
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { isVerified } }
      );
    } else {
      await db.collection("kyc").updateOne(
        { userId },
        { $set: { [type]: status } }
      );
    }
  } else {
    if (!(memoryStore.kyc as any)[userId]) {
      (memoryStore.kyc as any)[userId] = { vehicle: 'pending', pan: 'pending', aadhaar: 'pending', photo: 'pending', isVerified: false };
    }
    
    if (type === 'all') {
      const isVerified = status === 'verified';
      (memoryStore.kyc as any)[userId] = {
        vehicle: status,
        pan: status,
        aadhaar: status,
        photo: status,
        isVerified
      };
      const user = memoryStore.users.find(u => u.id === userId);
      if (user) (user as any).isVerified = isVerified;
    } else {
      (memoryStore.kyc as any)[userId][type] = status;
      const k = (memoryStore.kyc as any)[userId];
      if (k.vehicle === 'verified' && k.pan === 'verified' && k.aadhaar === 'verified' && k.photo === 'verified') {
        k.isVerified = true;
        const user = memoryStore.users.find(u => u.id === userId);
        if (user) (user as any).isVerified = true;
      }
    }
  }
  res.json({ success: true });
});

router.get("/stats", async (req, res) => {
  let stats;
  if (db) {
    const usersCount = await db.collection("users").countDocuments();
    const ridesCount = await db.collection("rides").countDocuments();
    const rides = await db.collection("rides").find().toArray();
    const kycCount = await db.collection("kyc").countDocuments({ 
      $or: [{ vehicle: 'pending' }, { pan: 'pending' }, { aadhaar: 'pending' }] 
    });
    
    stats = {
      totalUsers: usersCount || 3,
      totalRides: ridesCount,
      pendingKYC: kycCount,
      revenue: rides.reduce((acc: any, curr: any) => acc + (parseFloat(curr.fare) || 0), 0)
    };
  } else {
    stats = {
      totalUsers: memoryStore.users.length,
      totalRides: memoryStore.rides.length,
      pendingKYC: Object.values(memoryStore.kyc).filter(k => Object.values(k).includes('pending')).length,
      revenue: memoryStore.rides.reduce((acc, curr) => acc + curr.fare, 0)
    };
  }
  res.json(stats);
});

export default router;
