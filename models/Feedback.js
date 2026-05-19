const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, trim: true },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
