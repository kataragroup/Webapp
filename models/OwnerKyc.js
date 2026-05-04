const mongoose = require("mongoose");

/**
 * OwnerKyc Schema
 * Used when: driverType = "Owner_driver"
 * Only owner details are required (owner IS the driver)
 */
const ownerKycSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      unique: true,
    },

    // ── OWNER TYPE ──────────────────────────────────────────────────────────
    driverType: {
      type: String,
      enum: ["Owner_driver"],
      default: "Owner_driver",
    },

    // ── AADHAAR ─────────────────────────────────────────────────────────────
    aadhar: {
      frontImage: { type: String, required: true },
      backImage:  { type: String, required: true },
      name:       { type: String, required: true },
      number:     { type: String, required: true },
      dob:        { type: Date,   required: true },
    },

    // ── PAN ─────────────────────────────────────────────────────────────────
    pan: {
      frontImage: { type: String, required: true },
      name:       { type: String, required: true },
      number:     { type: String, required: true },
    },

    // ── DRIVING LICENCE ─────────────────────────────────────────────────────
    licence: {
      frontImage: { type: String, required: true },
      backImage:  { type: String, required: true },
      number:     { type: String, required: true },
      dob:        { type: Date,   required: true },
    },
    licenceType: {
      type: String,
      enum: ["Non-Transport", "Transport"],
      required: true,
    },
    licenceExpiry: {
      type: Date,
      required: true,
    },

    // ── PROFILE SELFIE ───────────────────────────────────────────────────────
    profileImage: { type: String, default: null },

    // ── CURRENT ADDRESS ─────────────────────────────────────────────────────
    currentAddress: {
      city:            { type: String, required: true },
      pincode:         { type: String, required: true },
      houseno:         { type: String, default: null },
      agreementImage:  { type: String, default: null },
      lightbillImage:  { type: String, default: null },
    },

    // ── VEHICLE ─────────────────────────────────────────────────────────────
    vehicle: {
      type:   { type: String, enum: ["Taxi", "Auto riksha", "Bike"], required: true },
      brand:  { type: String, required: true },
      model:  { type: String, required: true },
      number: { type: String, required: true },
    },

    // ── VEHICLE DOCUMENTS ───────────────────────────────────────────────────
    vehicleDocs: {
      rcImage:          { type: String, required: true },
      insuranceImage:   { type: String, required: true },
      roadTaxImage:     { type: String, default: null },
      pucImage:         { type: String, required: true },
      permitImage:      { type: String, default: null },
      fitnessImage:     { type: String, default: null },
    },

    // ── KYC STATUS ──────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String, default: null },

    // ── ADMIN NOTES ─────────────────────────────────────────────────────────
    adminNotes: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerKyc", ownerKycSchema);