<<<<<<< HEAD
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//     },
//     email: {
//       type: String,
//       unique: true,
//       sparse: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otpHash: { type: String, default: null },
//     otpExpiresAt: { type: Date, default: null },
//     otpLastSentAt: { type: Date, default: null },
//     otpSendCount: { type: Number, default: 0 },
//     otpVerifyAttempts: { type: Number, default: 0 },
//     otpLockedUntil: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// userSchema.set("toJSON", {
//   transform: (_doc, ret) => {
//     delete ret.otpHash;
//     delete ret.otpExpiresAt;
//     delete ret.otpLastSentAt;
//     delete ret.otpSendCount;
//     delete ret.otpVerifyAttempts;
//     delete ret.otpLockedUntil;
//     delete ret.__v;
//     return ret;
//   },
// });

// module.exports = mongoose.model("User", userSchema);


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
    isVerified: {
      type: Boolean,
      default: false,
    },
    isKycComplete: {
      type: Boolean,
      default: false,
    },

    otpHash: { type: String, default: null },
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
=======

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, required: true, unique: true, index: true },
  email: String,

  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },

  lastLogin: Date,

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
>>>>>>> e3152cd0b4bd64a3e0d1c4daa0d8f02cad52ca6d
