import express from "express";
import { memoryStore, db } from "../data/store";

const router = express.Router();

// OTP Generation helper
// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Login OTP Request
router.post("/login-otp", (req, res) => {
  const { identity } = req.body;
  const user = memoryStore.users.find(u => u.email === identity || u.phone === identity);
  
  if (!user) {
    return res.status(404).json({ message: "Identity not recognized. Please register first." });
  }

  const otp = "1234"; // Fixed for demo, but normally generateOTP()
  memoryStore.otps[identity] = otp;
  console.log(`OTP for ${identity}: ${otp}`);
  res.json({ message: "OTP sent successfully", identity });
});

// Verify Login/Register OTP
router.post("/verify", (req, res) => {
  const { identity, otp } = req.body;
  const savedOtp = memoryStore.otps[identity];

  if (otp === "1234" || otp === savedOtp) {
    delete memoryStore.otps[identity];
    const user = memoryStore.users.find(u => u.email === identity || u.phone === identity);
    
    if (user) {
      if (user.role === 'driver') {
        const kycStatus = (memoryStore.kyc as any)[user.id];
        (user as any).isVerified = kycStatus?.isVerified || false;
      }
      res.json({ success: true, user });
    } else {
      res.json({ success: true, message: "OTP Verified. Proceed to create account." });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid verification code" });
  }
});

// Registration with OTP
router.post("/register-otp", (req, res) => {
  const { phone, email } = req.body;
  
  const existing = memoryStore.users.find(u => u.email === email || u.phone === phone);
  if (existing) {
    return res.status(400).json({ message: "Email or Phone already registered" });
  }

  const otp = "1234";
  memoryStore.otps[phone] = otp;
  res.json({ message: "Verification code sent to " + phone });
});

router.post("/register", async (req, res) => {
  const { fullName, email, phone, role, location, otp } = req.body;
  
  if (otp !== "1234") {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const newUser = { 
    id: (memoryStore.users.length + 1).toString(), 
    name: fullName, 
    email, 
    phone, 
    role, 
    location,
    isVerified: role === 'user'
  };
  
  if (db) {
    await db.collection("users").insertOne(newUser);
  } else {
    memoryStore.users.push(newUser);
  }

  if (role === 'driver') {
    (memoryStore.kyc as any)[newUser.id] = { vehicle: 'pending', pan: 'pending', aadhaar: 'pending', photo: 'pending', isVerified: false };
  }

  res.status(201).json(newUser);
});

export default router;
