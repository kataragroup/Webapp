const express    = require("express");
const router     = express.Router();
const { verifyAdmin } = require("../middlewares/adminAuth");
const Driver     = require("../models/Driver");
const Kyc        = require("../models/Kyc");

// ─── ALL DRIVERS ──────────────────────────────────────────────────────────────
// GET /api/admin/drivers/all
router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json({ success: true, count: drivers.length, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── SINGLE DRIVER WITH KYC ───────────────────────────────────────────────────
// GET /api/admin/drivers/:driverId
router.get("/:driverId", verifyAdmin, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    // Also fetch KYC details
    const kyc = await Kyc.findOne({ driverId: req.params.driverId });

    res.json({ success: true, data: { driver, kyc: kyc || null } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ONLINE DRIVERS ───────────────────────────────────────────────────────────
// GET /api/admin/drivers/online/list
router.get("/online/list", verifyAdmin, async (req, res) => {
  try {
    const drivers = await Driver.find({ isOnline: true }).sort({ lastSeen: -1 });
    res.json({ success: true, count: drivers.length, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── BLOCK / UNBLOCK DRIVER ──────────────────────────────────────────────────
// PUT /api/admin/drivers/:driverId/block
router.put("/:driverId/block", verifyAdmin, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { isOnline: false },
      { returnDocument: 'after' }
    );
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }
    res.json({ success: true, message: "Driver blocked (forced offline)", data: driver });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;