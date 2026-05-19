import express from "express";
import { memoryStore, db } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  let wallet = memoryStore.wallets.find((w) => w.userId === req.user.id);

  if (db) {
    wallet = await db.collection("wallets").findOne({ userId: req.user.id });
  }

  if (!wallet) {
    const newWallet = { userId: req.user.id, balance: 0, updatedAt: new Date().toISOString() };
    if (db) {
      await db.collection("wallets").insertOne(newWallet);
      wallet = newWallet;
    } else {
      memoryStore.wallets.push(newWallet);
      wallet = newWallet;
    }
  }

  return res.json({ success: true, data: wallet });
});

router.get("/transactions", requireAuth, async (req: AuthRequest, res) => {
  let txns = memoryStore.walletTransactions.filter((txn) => txn.userId === req.user.id);
  if (db) {
    txns = await db.collection("walletTransactions").find({ userId: req.user.id }).toArray();
  }
  return res.json({ success: true, count: txns.length, data: txns });
});

export default router;
