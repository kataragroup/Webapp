const Driver = require("../models/Driver");

// ─── GO ONLINE ────────────────────────────────────────────────────────────────
// POST /api/driver/go-online  { lat, lng }
// Auth: Bearer token required (driverId comes from token, not body)
exports.goOnline = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.user?._id;
    let { lat, lng } = req.body;

    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (lat == null || lng == null) {
      return res.status(400).json({ success: false, message: "lat and lng required" });
    }

    lat = Number(lat);
    lng = Number(lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: "lat and lng must be numbers" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        isOnline: true,
        location: { type: "Point", coordinates: [lng, lat] },
        lastSeen: new Date(),
      },
      { returnDocument: 'after' }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("driver-status", { driverId: driver._id, isOnline: true });
    }

    return res.json({ success: true, message: "Driver is now ONLINE", data: driver });
  } catch (err) {
    console.error("❌ goOnline error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.goOffline = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.user?._id;

    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { isOnline: false, lastSeen: new Date() },
      { returnDocument: 'after' }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("driver-status", { driverId: driver._id, isOnline: false });
    }

    return res.json({ success: true, message: "Driver is now OFFLINE", data: driver });
  } catch (err) {
    console.error("❌ goOffline error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.user?._id;

    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    return res.json({ success: true, data: driver });
  } catch (err) {
    console.error("❌ getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.user?._id;
    let { lat, lng } = req.body;

    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (lat == null || lng == null) {
      return res.status(400).json({ success: false, message: "lat and lng required" });
    }

    lat = Number(lat);
    lng = Number(lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: "lat and lng must be numbers" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        location: { type: "Point", coordinates: [lng, lat] },
        lastSeen: new Date(),
      },
      { returnDocument: 'after' }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("driver-location", {
        driverId: driver._id,
        lat,
        lng,
        lastSeen: driver.lastSeen,
      });
    }

    return res.json({ success: true, message: "Location updated", data: driver });
  } catch (err) {
    console.error("❌ updateLocation error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateDriverType = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.user?._id;
    const { driverType } = req.body;

    if (!["Owner_driver", "Freelance_driver"].includes(driverType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid driver type. Use 'Owner_driver' or 'Freelance_driver'",
      });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { driverType },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    return res.json({
      success: true,
      message: `Driver type updated to ${driverType}`,
      data: driver,
    });
  } catch (err) {
    console.error("❌ updateDriverType error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng query parameters are required" });
    }

    const drivers = await Driver.find({
      isOnline: true,
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius),
        },
      },
    }).select("-otpCode -otpExpiresAt -otpLastSentAt -otpSendCount -otpVerifyAttempts -otpLockedUntil");

    return res.json({ success: true, count: drivers.length, data: drivers });
  } catch (err) {
    console.error("❌ getNearbyDrivers error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId).select("-otpCode -otpExpiresAt -otpLastSentAt -otpSendCount -otpVerifyAttempts -otpLockedUntil");
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }
    return res.json({ success: true, data: driver });
  } catch (err) {
    console.error("❌ getDriverById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
