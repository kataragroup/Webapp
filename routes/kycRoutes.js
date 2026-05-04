const express   = require("express");
const router    = express.Router();
const multer    = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  submitOwnerKyc,
  getOwnerKycStatus,
  submitFreelanceStep1,
  submitFreelanceStep2,
  getFreelanceKycStatus,
} = require("../controllers/kycController");

// ─── MULTER SETUP ─────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG files are allowed"));
    }
  },
});

// ─── OWNER-DRIVER: all fields in one upload ───────────────────────────────────
const ownerKycUpload = upload.fields([
  // Aadhaar
  { name: "aadharFront",    maxCount: 1 },
  { name: "aadharBack",     maxCount: 1 },
  // PAN
  { name: "panFront",       maxCount: 1 },
  // Licence
  { name: "licenceFront",   maxCount: 1 },
  { name: "licenceBack",    maxCount: 1 },
  // Selfie
  { name: "profileImage",   maxCount: 1 },
  // Address
  { name: "agreementImage", maxCount: 1 },
  { name: "lightbillImage", maxCount: 1 },
  // Vehicle docs
  { name: "rcImage",        maxCount: 1 },
  { name: "insuranceImage", maxCount: 1 },
  { name: "roadTaxImage",   maxCount: 1 }, // optional
  { name: "pucImage",       maxCount: 1 },
  { name: "permitImage",    maxCount: 1 }, // optional
  { name: "fitnessImage",   maxCount: 1 }, // optional
]);

// ─── FREELANCE STEP 1: Owner + Vehicle docs ───────────────────────────────────
const freelanceStep1Upload = upload.fields([
  // Owner Aadhaar
  { name: "ownerAadharFront", maxCount: 1 },
  { name: "ownerAadharBack",  maxCount: 1 },
  // Owner PAN
  { name: "ownerPanFront",    maxCount: 1 },
  // Owner Selfie
  { name: "ownerSelfie",      maxCount: 1 },
  // Owner Address
  { name: "agreementImage",   maxCount: 1 },
  { name: "lightbillImage",   maxCount: 1 },
  // Vehicle docs
  { name: "rcImage",          maxCount: 1 },
  { name: "insuranceImage",   maxCount: 1 },
  { name: "roadTaxImage",     maxCount: 1 }, // optional
  { name: "pucImage",         maxCount: 1 },
  { name: "permitImage",      maxCount: 1 }, // optional
  { name: "fitnessImage",     maxCount: 1 }, // optional
]);

// ─── FREELANCE STEP 2: Driver docs only ──────────────────────────────────────
const freelanceStep2Upload = upload.fields([
  // Driver Aadhaar
  { name: "driverAadharFront",  maxCount: 1 },
  { name: "driverAadharBack",   maxCount: 1 },
  // Driver Licence
  { name: "driverLicenceFront", maxCount: 1 },
  { name: "driverLicenceBack",  maxCount: 1 },
  // Driver Selfie
  { name: "driverSelfie",       maxCount: 1 },
]);

// ═════════════════════════════════════════════════════════════════════════════
//  ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// ── Owner-Driver KYC ──────────────────────────────────────────────────────────
// POST   /api/kyc/owner/submit   → Submit full KYC (single step)
// GET    /api/kyc/owner/status   → Get KYC status
router.post("/owner/submit", authMiddleware, ownerKycUpload, submitOwnerKyc);
router.get("/owner/status",  authMiddleware, getOwnerKycStatus);

// ── Freelance-Driver KYC ──────────────────────────────────────────────────────
// POST   /api/kyc/freelance/step1   → Step 1: Owner details
// POST   /api/kyc/freelance/step2   → Step 2: Driver details
// GET    /api/kyc/freelance/status  → Get KYC status + next step info
router.post("/freelance/step1",  authMiddleware, freelanceStep1Upload, submitFreelanceStep1);
router.post("/freelance/step2",  authMiddleware, freelanceStep2Upload, submitFreelanceStep2);
router.get("/freelance/status",  authMiddleware, getFreelanceKycStatus);

module.exports = router;