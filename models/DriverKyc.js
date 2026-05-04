const mongoose = require("mongoose");

/**
 * FreelanceKyc Schema
 * Used when: driverType = "Freelance_driver"
 * Both owner details AND driver details are required
 * Flow: Owner fills their details first → then driver details
 */
const freelanceKycSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      unique: true,
    },

    // ── DRIVER TYPE ─────────────────────────────────────────────────────────
    driverType: {
      type: String,
      enum: ["Freelance_driver"],
      default: "Freelance_driver",
    },

    // ════════════════════════════════════════════════════════════════════════
    //  STEP 1 — OWNER DETAILS
    // ════════════════════════════════════════════════════════════════════════

    // ── OWNER AADHAAR ────────────────────────────────────────────────────────
    ownerAadhar: {
      frontImage: { type: String, required: true },
      backImage:  { type: String, required: true },
      name:       { type: String, required: true },
      number:     { type: String, required: true },
      dob:        { type: Date,   required: true },
    },

    // ── OWNER PAN ───────────────────────────────────────────────────────────
    ownerPan: {
      frontImage: { type: String, required: true },
      name:       { type: String, required: true },
      number:     { type: String, required: true },
    },

    // ── OWNER SELFIE ────────────────────────────────────────────────────────
    ownerSelfie: { type: String, default: null },

    // ── OWNER ADDRESS ───────────────────────────────────────────────────────
    ownerAddress: {
      city:           { type: String, required: true },
      pincode:        { type: String, required: true },
      houseno:        { type: String, default: null },
      agreementImage: { type: String, default: null },
      lightbillImage: { type: String, default: null },
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
      rcImage:        { type: String, required: true },
      insuranceImage: { type: String, required: true },
      roadTaxImage:   { type: String, default: null },
      pucImage:       { type: String, required: true },
      permitImage:    { type: String, default: null },
      fitnessImage:   { type: String, default: null },
    },

    // ── STEP 1 COMPLETION FLAG ───────────────────────────────────────────────
    ownerStepComplete: { type: Boolean, default: false },

    // ════════════════════════════════════════════════════════════════════════
    //  STEP 2 — DRIVER DETAILS (Filled after owner step is done)
    // ════════════════════════════════════════════════════════════════════════

    // ── DRIVER AADHAAR ───────────────────────────────────────────────────────
    driverAadhar: {
      frontImage: { type: String, default: null },
      backImage:  { type: String, default: null },
      name:       { type: String, default: null },
      number:     { type: String, default: null },
      dob:        { type: Date,   default: null },
    },

    // ── DRIVER LICENCE ──────────────────────────────────────────────────────
    driverLicence: {
      frontImage: { type: String, default: null },
      backImage:  { type: String, default: null },
      number:     { type: String, default: null },
      dob:        { type: Date,   default: null },
    },
    driverLicenceType: {
      type: String,
      enum: ["Non-Transport", "Transport", null],
      default: null,
    },
    driverLicenceExpiry: {
      type: Date,
      default: null,
    },

    // ── DRIVER SELFIE ────────────────────────────────────────────────────────
    driverSelfie: { type: String, default: null },

    // ── STEP 2 COMPLETION FLAG ───────────────────────────────────────────────
    driverStepComplete: { type: Boolean, default: false },

    // ════════════════════════════════════════════════════════════════════════
    //  KYC STATUS
    // ════════════════════════════════════════════════════════════════════════
    status: {
      type: String,
      enum: ["Pending", "Owner_Step_Done", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String, default: null },
    adminNotes:      { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FreelanceKyc", freelanceKycSchema);