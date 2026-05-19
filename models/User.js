const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'driver', 'admin'],
      default: 'user',
    },
    location: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isKycComplete: {
      type: Boolean,
      default: false,
    },
    otpCode: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpLastSentAt: { type: Date, default: null },
    otpSendCount: { type: Number, default: 0 },
    otpVerifyAttempts: { type: Number, default: 0 },
    otpLockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.otpHash;
    delete ret.otpExpiresAt;
    delete ret.otpLastSentAt;
    delete ret.otpSendCount;
    delete ret.otpVerifyAttempts;
    delete ret.otpLockedUntil;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);

