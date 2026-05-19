const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name:  { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },

    // ── AUTH ──
    isVerified: { type: Boolean, default: false },
    otpCode:    { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpLastSentAt: { type: Date, default: null },
    otpSendCount: { type: Number, default: 0 },
    otpVerifyAttempts: { type: Number, default: 0 },
    otpLockedUntil: { type: Date, default: null },

    // ── KYC ──
    isKycComplete: { type: Boolean, default: false },
    driverType: {
      type: String,
      enum: ["Owner_driver", "Freelance_driver", null],
      default: null,
    },

    // ── ONLINE STATUS ──
    isOnline: { type: Boolean, default: false },

    // ── GEO ──
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

driverSchema.index({ location: "2dsphere" });

driverSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.otpCode;
    delete ret.otpExpiresAt;
    delete ret.otpLastSentAt;
    delete ret.otpSendCount;
    delete ret.otpVerifyAttempts;
    delete ret.otpLockedUntil;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Driver", driverSchema);

