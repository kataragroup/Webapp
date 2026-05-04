import express from "express";
import { memoryStore, db } from "../data/store";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  if (db) {
    const rides = await db.collection("rides").find().toArray();
    res.json(rides.map((r: any) => ({ ...r, id: r.id || r._id.toString() })));
  } else {
    res.json(memoryStore.rides);
  }
});

router.post("/", async (req, res) => {
  const newRide = { 
    ...req.body, 
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'confirmed',
    pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
    driverDetails: {
      name: 'Rahul Sharma',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      vehicleNumber: 'DL 2C B 5678',
      vehicleModel: 'Maruti Suzuki Dzire (White)',
      rating: 4.9
    }
  };

  if (db) {
    const result = await db.collection("rides").insertOne(newRide);
    res.status(201).json({ ...newRide, id: result.insertedId });
  } else {
    const rideWithId = { ...newRide, id: `R${Math.random().toString(36).substr(2, 9)}` };
    memoryStore.rides.unshift(rideWithId);
    res.status(201).json(rideWithId);
  }
});

router.post("/:id/accept", async (req, res) => {
  const { driverId, driverDetails } = req.body;
  const rideId = req.params.id;

  if (db) {
     await db.collection("rides").updateOne(
       { _id: new ObjectId(rideId) },
       { $set: { status: 'confirmed', driverId, driverDetails } }
     );
  } else {
     const ride = memoryStore.rides.find(r => r.id === rideId);
     if (ride) {
        (ride as any).status = 'confirmed';
        (ride as any).driverId = driverId;
        (ride as any).driverDetails = driverDetails;
     }
  }
  res.json({ success: true });
});

router.post("/:id/status", async (req, res) => {
  const { status } = req.body;
  const rideId = req.params.id;

  if (db) {
     try {
       await db.collection("rides").updateOne(
         { _id: new ObjectId(rideId) },
         { $set: { status } }
       );
     } catch (e) {
       await db.collection("rides").updateOne(
         { id: rideId },
         { $set: { status } }
       );
     }
  } else {
     const ride = memoryStore.rides.find(r => r.id === rideId);
     if (ride) {
        (ride as any).status = status;
     }
  }
  res.json({ success: true });
});

export default router;
