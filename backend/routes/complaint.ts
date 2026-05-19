import express from "express";
import { memoryStore, db } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { driverId, rideId, category, description } = req.body;

  if (!driverId || !rideId || !category || !description) {
    return res.status(400).json({ success: false, message: "driverId, rideId, category and description are required" });
  }

  const complaint = {
    id: `C${Date.now()}${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    driverId,
    rideId,
    category,
    description,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection("complaints").insertOne(complaint);
  } else {
    memoryStore.complaints.push(complaint);
  }

  return res.status(201).json({ success: true, data: complaint });
});

export default router;
