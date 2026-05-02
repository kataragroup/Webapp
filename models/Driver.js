// models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  licenseNumber: {
    type: String,
    required: true
  },

  licensePhoto: String,
  driverPhoto: String,

  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarOwner',
    required: true
  },

  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);