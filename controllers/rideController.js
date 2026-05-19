const Ride = require("../models/Ride");
const Driver = require("../models/Driver");

exports.createRide = async (req, res) => {
  try {
    const { pickup, drop, vehicleType, fare } = req.body;

    if (!pickup || !drop || !vehicleType || fare == null) {
      return res.status(400).json({
        success: false,
        message: "pickup, drop, vehicleType and fare are required",
      });
    }

    const ride = await Ride.create({
      userId: req.user._id,
      pickupLocation: { address: pickup, coordinates: [] },
      dropLocation: { address: drop, coordinates: [] },
      vehicleType,
      fare,
      status: "requested",
      paymentStatus: "pending",
    });

    return res.status(201).json({ success: true, data: ride });
  } catch (error) {
    console.error("❌ createRide error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    console.error("❌ getRideHistory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }
    return res.json({ success: true, data: ride });
  } catch (error) {
    console.error("❌ getRideById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const validStatus = ["requested", "accepted", "ongoing", "completed", "cancelled"];
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${validStatus.join(", ")}` });
    }

    const ride = await Ride.findOne({ _id: req.params.rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    if (ride.status === "completed" || ride.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cannot update a completed or cancelled ride" });
    }

    ride.status = status;
    if (status === "completed") ride.completedAt = new Date();
    if (status === "cancelled") ride.completedAt = new Date();
    await ride.save();

    return res.json({ success: true, message: "Ride status updated", data: ride });
  } catch (error) {
    console.error("❌ updateRideStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }
    if (ride.status === "completed") {
      return res.status(400).json({ success: false, message: "Cannot cancel a completed ride" });
    }

    ride.status = "cancelled";
    ride.completedAt = new Date();
    await ride.save();

    return res.json({ success: true, message: "Ride cancelled", data: ride });
  } catch (error) {
    console.error("❌ cancelRide error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }
    if (ride.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cannot complete a cancelled ride" });
    }

    ride.status = "completed";
    ride.completedAt = new Date();
    await ride.save();

    return res.json({ success: true, message: "Ride completed", data: ride });
  } catch (error) {
    console.error("❌ completeRide error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
