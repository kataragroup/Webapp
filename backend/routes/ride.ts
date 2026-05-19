import express from "express";
import { memoryStore, db } from "../data/store";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  if (db) {
    const rides = await db.collection("rides").find().toArray();
    const mappedRides = rides.map((r: any) => ({ ...r, id: r.id || r._id.toString() }));
    res.json({ success: true, count: mappedRides.length, data: mappedRides });
  } else {
    res.json({ success: true, count: memoryStore.rides.length, data: memoryStore.rides });
  }
});

router.post("/", async (req, res) => {
  const newRide = { 
    id: `R${Date.now()}${Math.floor(Math.random() * 1000)}`,
    ...req.body, 
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'confirmed',
    paymentStatus: 'pending',
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
    const storedRide = { ...newRide, id: result.insertedId.toString() };
    await db.collection("rides").updateOne({ _id: result.insertedId }, { $set: { id: storedRide.id } });
    res.status(201).json({ success: true, data: storedRide });
  } else {
    const rideWithId = { ...newRide, id: `R${Math.random().toString(36).substr(2, 9)}` };
    memoryStore.rides.unshift(rideWithId);
    res.status(201).json({ success: true, data: rideWithId });
  }
});

router.post("/:id/accept", async (req, res) => {
  const { driverId, driverDetails } = req.body;
  const rideId = req.params.id;

  if (db) {
     const query: any = { $or: [{ id: rideId }] };
     if (ObjectId.isValid(rideId)) {
       query.$or.push({ _id: new ObjectId(rideId) });
     }
     await db.collection("rides").updateOne(
       query,
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

router.get("/:id", async (req, res) => {
  const rideId = req.params.id;
  let ride = memoryStore.rides.find((r) => r.id === rideId);

  if (!ride && db) {
    const query: any = { $or: [{ id: rideId }] };
    if (ObjectId.isValid(rideId)) {
      query.$or.push({ _id: new ObjectId(rideId) });
    }
    const result = await db.collection("rides").findOne(query);
    ride = result || null;
  }

  if (!ride) {
    return res.status(404).json({ success: false, message: "Ride not found" });
  }

  return res.json({ success: true, data: ride });
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const rideId = req.params.id;

  if (db) {
     const query: any = { $or: [{ id: rideId }] };
     if (ObjectId.isValid(rideId)) {
       query.$or.push({ _id: new ObjectId(rideId) });
     }
     await db.collection("rides").updateOne(
       query,
       { $set: { status } }
     );
  } else {
     const ride = memoryStore.rides.find(r => r.id === rideId);
     if (ride) {
        (ride as any).status = status;
     }
  }
  res.json({ success: true });
});

export default router;
