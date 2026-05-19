import express from "express";
import { memoryStore, db } from "../data/store";

const router = express.Router();

router.get("/nearby", (req, res) => {
  // Simulate slight movement for "live" feel
  memoryStore.driverPositions.forEach(d => {
    d.lat += (Math.random() - 0.5) * 0.0005;
    d.lng += (Math.random() - 0.5) * 0.0005;
  });
  res.json(memoryStore.driverPositions);
});

router.get("/kyc/:id", async (req, res) => {
  const userId = req.params.id;
  if (db) {
    const status = await db.collection("kyc").findOne({ userId });
    res.json(status || { vehicle: 'none', pan: 'none', aadhaar: 'none' });
  } else {
    res.json((memoryStore.kyc as any)[userId] || { vehicle: 'none', pan: 'none', aadhaar: 'none' });
  }
});

router.post("/kyc/:id", async (req, res) => {
  const { type, status } = req.body;
  const userId = req.params.id;
  
  if (db) {
    await db.collection("kyc").updateOne(
      { userId },
      { $set: { [type]: status || 'pending' } },
      { upsert: true }
    );
  } else {
    if (!(memoryStore.kyc as any)[userId]) {
      (memoryStore.kyc as any)[userId] = { vehicle: 'none', pan: 'none', aadhaar: 'none' };
    }
    (memoryStore.kyc as any)[userId][type] = status || 'pending';
  }
  res.json({ success: true });
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  let user = memoryStore.users.find((u) => u.id === userId);
  if (!user && db) {
    user = await db.collection("users").findOne({ id: userId });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: "Driver not found" });
  }

  return res.json({ success: true, data: user });
});

export default router;
