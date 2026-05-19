import express from "express";
import { memoryStore, db, Payment } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/create", requireAuth, async (req: AuthRequest, res) => {
  const { rideId, amount, paymentMethod } = req.body;

  if (!rideId || amount == null || !paymentMethod) {
    return res.status(400).json({ success: false, message: "rideId, amount and paymentMethod are required" });
  }

  const payment: Payment = {
    id: `P${Date.now()}${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    rideId,
    amount,
    method: paymentMethod,
    status: "success",
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection("payments").insertOne(payment);
    await db.collection("rides").updateOne({ id: rideId }, { $set: { paymentStatus: "paid" } });
  } else {
    memoryStore.payments.push(payment);
    const ride = memoryStore.rides.find((ride) => ride.id === rideId);
    if (ride) {
      (ride as any).paymentStatus = "paid";
    }
  }

  return res.status(201).json({ success: true, data: payment });
});

router.get("/:paymentId", requireAuth, async (req: AuthRequest, res) => {
  const paymentId = req.params.paymentId;

  let payment = memoryStore.payments.find((p) => p.id === paymentId);
  if (!payment && db) {
    payment = await db.collection("payments").findOne({ id: paymentId });
  }

  if (!payment || payment.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: "Payment not found" });
  }

  return res.json({ success: true, data: payment });
});

router.get("/history", requireAuth, async (req: AuthRequest, res) => {
  let payments = memoryStore.payments.filter((p) => p.userId === req.user.id);
  if (db) {
    payments = await db.collection("payments").find({ userId: req.user.id }).toArray();
  }
  return res.json({ success: true, count: payments.length, data: payments });
});

export default router;
