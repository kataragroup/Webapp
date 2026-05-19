import express from "express";
import { memoryStore, db } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { label, address, coordinates } = req.body;

  if (!label || !address) {
    return res.status(400).json({ success: false, message: "label and address are required" });
  }

  const savedAddress = {
    id: `A${Date.now()}${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    label,
    address,
    coordinates: Array.isArray(coordinates) ? coordinates : [],
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.collection("addresses").insertOne(savedAddress);
  } else {
    memoryStore.addresses.push(savedAddress);
  }

  return res.status(201).json({ success: true, data: savedAddress });
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  let addresses = memoryStore.addresses.filter((addr) => addr.userId === req.user.id);
  if (db) {
    addresses = await db.collection("addresses").find({ userId: req.user.id }).toArray();
  }
  return res.json({ success: true, count: addresses.length, data: addresses });
});

router.delete("/:addressId", requireAuth, async (req: AuthRequest, res) => {
  const addressId = req.params.addressId;

  if (db) {
    const result = await db.collection("addresses").deleteOne({ id: addressId, userId: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
  } else {
    const index = memoryStore.addresses.findIndex((addr) => addr.id === addressId && addr.userId === req.user.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    memoryStore.addresses.splice(index, 1);
  }

  return res.json({ success: true, message: "Address deleted" });
});

export default router;
