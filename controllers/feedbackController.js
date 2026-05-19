const Feedback = require("../models/Feedback");
const Ride = require("../models/Ride");

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, rideId, driverId } = req.body;

    if (!rideId || rating == null) {
      return res.status(400).json({ success: false, message: "rideId and rating are required" });
    }

    const ride = await Ride.findOne({ _id: rideId, userId: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      rideId,
      driverId,
      rating,
      comment,
    });

    return res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error("❌ submitFeedback error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
