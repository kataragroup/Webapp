const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

exports.getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id }) || await Wallet.create({ userId: req.user._id });
    return res.json({ success: true, data: { balance: wallet.balance, currency: wallet.currency } });
  } catch (error) {
    console.error("❌ getWalletBalance error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getWalletTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error("❌ getWalletTransactions error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
