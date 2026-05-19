import express from "express";
import { memoryStore, db } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { rideId, driverId, rating, comment } = req.body;

  if (!rideId || rating == null) {
    return res.status(400).json({ success: false, message: "rideId and rating are required" });
  }

  const feedback = {
    id: `F${Date.now()}${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    rideId,
    driverId,
    rating,
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection("feedbacks").insertOne(feedback);
  } else {
    memoryStore.feedbacks.push(feedback);
  }

  return res.status(201).json({ success: true, data: feedback });
});

export default router;
