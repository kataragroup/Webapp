const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const {
  getWalletBalance,
  getWalletTransactions,
} = require("../controllers/walletController");

router.get("/", userAuthMiddleware, getWalletBalance);
router.get("/transactions", userAuthMiddleware, getWalletTransactions);

module.exports = router;
