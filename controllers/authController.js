const Driver = require("../models/Driver");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const OTP_TTL_MS              = 10 * 60 * 1000; 
const OTP_RESEND_COOLDOWN_MS  = 30 * 1000;
const OTP_MAX_SENDS_PER_HOUR  = 15;
const OTP_MAX_VERIFY_ATTEMPTS = 10;
const OTP_LOCK_MS             = 15 * 60 * 1000;

const normalizePhone = (phone) => {
  let digits = typeof phone === "string" ? phone.replace(/[^\d]/g, "") : "";
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  return digits;
};
const isValidPhone = (digits) => digits.length >= 10 && digits.length <= 15;
const generateOTP  = () => Math.floor(100000 + Math.random() * 900000).toString();
const signToken    = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeDriverResponse = (d) => ({
  id: d._id,
  name: d.name,
  email: d.email,
  phone: d.phone,
  isVerified: d.isVerified,
  isKycComplete: d.isKycComplete || false,
  isOnline: d.isOnline || false,
  createdAt: d.createdAt,
});

const sendOtpOutOfBand = async ({ phone, otp }) => {
  console.log(`📱 [SERVER OTP LOG] Phone: ${phone} | OTP: ${otp}`);
  try {
    await axios.post("https://www.fast2sms.com/dev/bulkV2", 
      { variables_values: otp, route: "otp", numbers: phone },
      { headers: { authorization: process.env.FAST2SMS_API_KEY } }
    );
  } catch (err) {
    console.error("SMS Error (Account verification might be pending):", err?.response?.data?.message || err.message);
  }
};

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    let { name, phone, email } = req.body;
    phone = normalizePhone(phone);

    if (!name || !isValidPhone(phone)) {
      return res.status(400).json({ success: false, message: "Valid name and 10-digit phone number required" });
    }

    let driver = await Driver.findOne({ phone });
    if (driver) {
      // User exists, update name/email and send OTP for login-like flow
      driver.name = name;
      if (email) driver.email = email;
    } else {
      // New user registration
      driver = new Driver({ name, phone, email });
    }

    const otp = generateOTP();
    driver.otpCode = otp;
    driver.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await driver.save();

    await sendOtpOutOfBand({ phone, otp });
    res.json({ success: true, message: "OTP sent to your phone" });
  } catch (e) {
    console.error("Register Error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.emailOrPhone);
    if (!phone) return res.status(400).json({ success: false, message: "Phone number is required" });

    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(404).json({ success: false, message: "User not found. Please register first." });
    }

    const otp = generateOTP();
    driver.otpCode = otp;
    driver.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await driver.save();

    await sendOtpOutOfBand({ phone, otp });
    res.json({ success: true, message: "OTP sent to your registered phone" });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── VERIFY ──
exports.verifyOtp = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    const phone = normalizePhone(emailOrPhone);
    const otpStr = String(otp || "").trim();

    console.log(`🔍 Verification Attempt | Phone: ${phone} | Input OTP: ${otpStr}`);

    const driver = await Driver.findOne({ phone });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    // 1. Check if OTP exists
    if (!driver.otpCode || !driver.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "No active OTP request found. Please resend OTP." });
    }

    // 2. Check Expiry
    if (new Date() > driver.otpExpiresAt) {
      console.log(`❌ OTP Expired for ${phone}`);
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    // 3. Match Code
    if (driver.otpCode !== otpStr) {
      console.log(`❌ Invalid OTP for ${phone} (Expected: ${driver.otpCode}, Got: ${otpStr})`);
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    console.log(`✅ OTP Verified Successfully for ${phone}`);

    // Clear OTP and verify driver
    driver.isVerified = true;
    driver.otpCode = null;
    driver.otpExpiresAt = null;
    await driver.save();

    const token = signToken(driver._id);
    const data = safeDriverResponse(driver);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: data,   // Flutter Compatibility
      driver: data  // Consistency
    });
  } catch (e) {
    console.error("Verify Error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};