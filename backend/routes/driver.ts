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

export default router;
