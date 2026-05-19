const Payment = require("../models/Payment");
const Ride = require("../models/Ride");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

exports.createPayment = async (req, res) => {
  try {
    const { rideId, amount, paymentMethod } = req.body;

    if (!rideId || amount == null || !paymentMethod) {
      return res.status(400).json({ success: false, message: "rideId, amount and paymentMethod are required" });
    }

    const ride = await Ride.findOne({ _id: rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const payment = await Payment.create({
      rideId,
      userId: req.user._id,
      amount,
      method: paymentMethod,
      status: paymentMethod === "wallet" ? "pending" : "pending"
    });

    ride.paymentStatus = "pending";
    await ride.save();

    if (paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ userId: req.user._id }) || await Wallet.create({ userId: req.user._id });
      if (wallet.balance < amount) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
      }

      wallet.balance -= amount;
      await wallet.save();

      await WalletTransaction.create({
        userId: req.user._id,
        amount,
        type: "debit",
        source: "ride_payment",
        status: "success",
        rideId,
        paymentId: payment._id,
        balanceAfter: wallet.balance,
      });

      payment.status = "success";
      await payment.save();
      ride.paymentStatus = "paid";
      await ride.save();
    }

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error("❌ createPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, userId: req.user._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    console.error("❌ getPaymentStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
