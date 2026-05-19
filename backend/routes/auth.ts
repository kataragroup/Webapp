import express from "express";
import { memoryStore, db } from "../data/store";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

const createToken = (user: any) => user.id;

const findUserByIdentity = async (identity: string) => {
  const allowed = (user: any) => user.email === identity || user.phone === identity;

  if (db) {
    return await db.collection("users").findOne({ $or: [{ email: identity }, { phone: identity }] });
  }

  return memoryStore.users.find(allowed);
};

const saveOrUpdateUser = async (user: any) => {
  if (db) {
    const existing = await db.collection("users").findOne({ id: user.id });
    if (existing) {
      await db.collection("users").updateOne({ id: user.id }, { $set: user });
    } else {
      await db.collection("users").insertOne(user);
    }
    return user;
  }

  const index = memoryStore.users.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    memoryStore.users[index] = user;
  } else {
    memoryStore.users.push(user);
  }
  return user;
};

router.post("/login", async (req, res) => {
  const { identity } = req.body;
  if (!identity) {
    return res.status(400).json({ success: false, message: "identity is required" });
  }

  const user = await findUserByIdentity(identity);
  if (!user) {
    return res.status(404).json({ success: false, message: "Identity not recognized. Please register first." });
  }

  const otp = "1234";
  memoryStore.otps[identity] = otp;
  console.log(`OTP for ${identity}: ${otp}`);
  return res.json({ success: true, message: "OTP sent successfully", identity });
});

router.post("/login-otp", async (req, res) => {
  const { identity } = req.body;
  if (!identity) {
    return res.status(400).json({ success: false, message: "identity is required" });
  }

  const user = await findUserByIdentity(identity);
  if (!user) {
    return res.status(404).json({ success: false, message: "Identity not recognized. Please register first." });
  }

  const otp = "1234";
  memoryStore.otps[identity] = otp;
  console.log(`OTP for ${identity}: ${otp}`);
  return res.json({ success: true, message: "OTP sent successfully", identity });
});

router.post("/verify", async (req, res) => {
  const { identity, otp } = req.body;
  const savedOtp = memoryStore.otps[identity];

  if (otp === "1234" || otp === savedOtp) {
    delete memoryStore.otps[identity];
    const user = await findUserByIdentity(identity);

    if (user) {
      if (user.role === "driver") {
        const kycStatus = (memoryStore.kyc as any)[user.id];
        (user as any).isVerified = kycStatus?.isVerified || false;
      }

      const token = createToken(user);
      return res.json({ success: true, user, token });
    }

    return res.json({ success: true, message: "OTP verified. Proceed to create account." });
  }

  return res.status(400).json({ success: false, message: "Invalid verification code" });
});

router.post("/register-otp", async (req, res) => {
  const { phone, email } = req.body;
  const existing = await findUserByIdentity(phone) || await findUserByIdentity(email);

  if (existing) {
    return res.status(400).json({ success: false, message: "Email or Phone already registered" });
  }

  const otp = "1234";
  memoryStore.otps[phone] = otp;
  return res.json({ success: true, message: `Verification code sent to ${phone}` });
});

router.post("/register", async (req, res) => {
  const { fullName, email, phone, role, location, otp } = req.body;
  if (otp !== "1234") {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const newUser = {
    id: (memoryStore.users.length + 1).toString(),
    name: fullName,
    email,
    phone,
    role,
    location,
    isVerified: role === "user" || false,
  };

  await saveOrUpdateUser(newUser);

  if (role === "driver") {
    (memoryStore.kyc as any)[newUser.id] = {
      vehicle: "pending",
      pan: "pending",
      aadhaar: "pending",
      photo: "pending",
      isVerified: false,
    };
  }

  const token = createToken(newUser);
  return res.status(201).json({ success: true, user: newUser, token });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  return res.json({ success: true, user: req.user });
});

const updateProfileHandler = async (req: AuthRequest, res: any) => {
  const updates = req.body;
  const user = { ...req.user, ...updates };
  await saveOrUpdateUser(user);
  return res.json({ success: true, user });
};

router.put("/profile", requireAuth, updateProfileHandler);
router.patch("/profile", requireAuth, updateProfileHandler);

export default router;
