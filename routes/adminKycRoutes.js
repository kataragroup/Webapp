const express = require("express");
const router  = express.Router();

const { verifyAdmin } = require("../middlewares/adminAuth");
const {
  getAllKyc,
  getSingleKyc,
  approveKyc,
  rejectKyc,
  getKycStats,
} = require("../controllers/adminKycController");

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN KYC ROUTES  (all protected by verifyAdmin)
// ═════════════════════════════════════════════════════════════════════════════

// GET  /api/admin/kyc/stats
//   → Dashboard summary counts (pending/approved/rejected by type)
router.get("/stats", verifyAdmin, getKycStats);

// GET  /api/admin/kyc/all?type=owner|freelance|all&status=Pending&page=1&limit=20
//   → Paginated list of all KYC records
router.get("/all", verifyAdmin, getAllKyc);

// GET  /api/admin/kyc/:type/:driverId
//   → Full KYC record for one driver  (:type = "owner" | "freelance")
router.get("/:type/:driverId", verifyAdmin, getSingleKyc);

// PUT  /api/admin/kyc/:type/approve/:driverId
//   → Approve KYC  (body: { adminNotes? })
router.put("/:type/approve/:driverId", verifyAdmin, approveKyc);

// PUT  /api/admin/kyc/:type/reject/:driverId
//   → Reject KYC   (body: { reason, adminNotes? })
router.put("/:type/reject/:driverId", verifyAdmin, rejectKyc);

module.exports = router;