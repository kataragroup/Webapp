const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const OTP_TTL_MS = 10 * 60 * 1000;
const normalizePhone = (phone) => {
  let digits = typeof phone === "string" ? phone.replace(/[^\d]/g, "") : "";
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  return digits;
};
const isValidPhone = (digits) => digits.length >= 10 && digits.length <= 15;
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location || null,
  role: user.role || "user",
  isVerified: user.isVerified,
  isKycComplete: user.isKycComplete || false,
  createdAt: user.createdAt,
});

const sendOtpOutOfBand = async ({ phone, otp }) => {
  console.log(`📱 [SERVER OTP LOG] Phone: ${phone} | OTP: ${otp}`);
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      { variables_values: otp, route: "otp", numbers: phone },
      { headers: { authorization: process.env.FAST2SMS_API_KEY } }
    );
  } catch (err) {
    console.error("SMS Error:", err?.response?.data?.message || err.message);
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, phone, email, role, location } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!fullName || !isValidPhone(normalizedPhone)) {
      return res.status(400).json({ success: false, message: "fullName and valid phone number are required" });
    }

    let user = await User.findOne({ phone: normalizedPhone });
    if (user) {
      user.name = fullName;
      if (email) user.email = email;
      if (location) user.location = location;
      if (role) user.role = role;
    } else {
      user = new User({ name: fullName, phone: normalizedPhone, email, role: role || "user", location });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    await sendOtpOutOfBand({ phone: normalizedPhone, otp });
    return res.json({ success: true, message: "OTP sent to your phone" });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identity } = req.body;
    if (!identity) {
      return res.status(400).json({ success: false, message: "identity is required" });
    }

    const phone = normalizePhone(identity);
    const query = phone ? { phone } : { email: identity.toLowerCase().trim() };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please register first." });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    await sendOtpOutOfBand({ phone: user.phone, otp });
    return res.json({ success: true, message: "OTP sent to your registered phone" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { identity, otp } = req.body;
    if (!identity || !otp) {
      return res.status(400).json({ success: false, message: "identity and otp are required" });
    }

    const phone = normalizePhone(identity);
    const query = phone ? { phone } : { email: identity.toLowerCase().trim() };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "No active OTP request found. Please resend OTP." });
    }
    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }
    if (user.otpCode !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = signToken(user._id);
    return res.json({ success: true, message: "Login successful", token, user: safeUserResponse(user) });
  } catch (error) {
    console.error("Verify Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    return res.json({ success: true, data: safeUserResponse(req.user) });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email, location } = req.body;
    if (!name && !phone && !email && !location) {
      return res.status(400).json({ success: false, message: "At least one field is required to update" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (location) updates.location = location;
    if (email) updates.email = email;
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      if (!isValidPhone(normalizedPhone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number" });
      }
      updates.phone = normalizedPhone;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    return res.json({ success: true, message: "Profile updated", data: safeUserResponse(updatedUser) });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
