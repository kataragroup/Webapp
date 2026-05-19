const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const { createPayment, getPaymentStatus } = require("../controllers/paymentController");

router.post("/create", userAuthMiddleware, createPayment);
router.get("/:paymentId", userAuthMiddleware, getPaymentStatus);

module.exports = router;
