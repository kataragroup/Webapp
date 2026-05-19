const Complaint = require("../models/Complaint");
const Ride = require("../models/Ride");

exports.submitComplaint = async (req, res) => {
  try {
    const { driverId, rideId, category, description } = req.body;

    if (!driverId || !rideId || !category || !description) {
      return res.status(400).json({ success: false, message: "driverId, rideId, category and description are required" });
    }

    const ride = await Ride.findOne({ _id: rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      driverId,
      rideId,
      category,
      description,
    });

    return res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    console.error("❌ submitComplaint error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
