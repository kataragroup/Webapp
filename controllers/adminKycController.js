const OwnerKyc     = require("../models/OwnerKyc");
const FreelanceKyc = require("../models/FreelanceKyc");
const Driver       = require("../models/Driver");

// ═════════════════════════════════════════════════════════════════════════════
//  HELPER: determine which collection to use based on type param or DB lookup
// ═════════════════════════════════════════════════════════════════════════════
const getKycModel = (type) => {
  if (type === "owner")     return OwnerKyc;
  if (type === "freelance") return FreelanceKyc;
  return null;
};

// ─── GET ALL KYC (Admin Panel List) ──────────────────────────────────────────
// GET /api/admin/kyc/all?type=owner|freelance|all&status=Pending|Approved|Rejected&page=1&limit=20
exports.getAllKyc = async (req, res) => {
  try {
    const { type = "all", status, page = 1, limit = 20 } = req.query;

    const skip   = (parseInt(page) - 1) * parseInt(limit);
    const filter = {};
    if (status) filter.status = status;

    const populateOpts = { path: "driverId", select: "name email phone isKycComplete" };

    let ownerKycs     = [];
    let freelanceKycs = [];

    if (type === "all" || type === "owner") {
      ownerKycs = await OwnerKyc.find(filter)
        .populate(populateOpts)
        .sort({ createdAt: -1 })
        .skip(type === "all" ? 0 : skip)
        .limit(type === "all" ? 0 : parseInt(limit));
    }

    if (type === "all" || type === "freelance") {
      freelanceKycs = await FreelanceKyc.find(filter)
        .populate(populateOpts)
        .sort({ createdAt: -1 })
        .skip(type === "all" ? 0 : skip)
        .limit(type === "all" ? 0 : parseInt(limit));
    }

    // ── Combine & sort by date if fetching all ────────────────────────────
    let combined = [
      ...ownerKycs.map((k) => ({ ...k.toObject(), kycType: "Owner_driver" })),
      ...freelanceKycs.map((k) => ({ ...k.toObject(), kycType: "Freelance_driver" })),
    ];

    if (type === "all") {
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      combined = combined.slice(skip, skip + parseInt(limit));
    }

    const totalOwner     = await OwnerKyc.countDocuments(filter);
    const totalFreelance = await FreelanceKyc.countDocuments(filter);

    return res.json({
      success: true,
      counts: {
        owner:     totalOwner,
        freelance: totalFreelance,
        total:     totalOwner + totalFreelance,
      },
      page:       parseInt(page),
      limit:      parseInt(limit),
      data:       combined,
    });
  } catch (error) {
    console.error("❌ getAllKyc error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE KYC ───────────────────────────────────────────────────────────
// GET /api/admin/kyc/:type/:driverId
// :type = "owner" | "freelance"
exports.getSingleKyc = async (req, res) => {
  try {
    const { type, driverId } = req.params;

    const KycModel = getKycModel(type);
    if (!KycModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "owner" or "freelance"',
      });
    }

    const kyc = await KycModel.findOne({ driverId }).populate(
      "driverId",
      "name email phone isVerified isKycComplete isOnline createdAt"
    );

    if (!kyc) {
      return res.status(404).json({ success: false, message: "KYC not found" });
    }

    return res.json({ success: true, kycType: type, data: kyc });
  } catch (error) {
    console.error("❌ getSingleKyc error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── APPROVE KYC ──────────────────────────────────────────────────────────────
// PUT /api/admin/kyc/:type/approve/:driverId
exports.approveKyc = async (req, res) => {
  try {
    const { type, driverId } = req.params;
    const { adminNotes }     = req.body;

    const KycModel = getKycModel(type);
    if (!KycModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "owner" or "freelance"',
      });
    }

    // For freelance, both steps must be complete before approval
    if (type === "freelance") {
      const kyc = await FreelanceKyc.findOne({ driverId });
      if (!kyc) {
        return res.status(404).json({ success: false, message: "KYC not found" });
      }
      if (!kyc.ownerStepComplete || !kyc.driverStepComplete) {
        return res.status(400).json({
          success: false,
          message: "Cannot approve: KYC steps are not fully complete.",
          ownerStepComplete:  kyc.ownerStepComplete,
          driverStepComplete: kyc.driverStepComplete,
        });
      }
    }

    const updatedKyc = await KycModel.findOneAndUpdate(
      { driverId },
      {
        status:          "Approved",
        rejectionReason: null,
        ...(adminNotes && { adminNotes }),
      },
      { new: true }
    );

    if (!updatedKyc) {
      return res.status(404).json({ success: false, message: "KYC not found" });
    }

    // ✅ Update Driver.isKycComplete = true
    await Driver.findByIdAndUpdate(driverId, { isKycComplete: true });

    return res.json({
      success: true,
      message: "KYC Approved Successfully",
      kycType: type,
      data:    updatedKyc,
    });
  } catch (error) {
    console.error("❌ approveKyc error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── REJECT KYC ───────────────────────────────────────────────────────────────
// PUT /api/admin/kyc/:type/reject/:driverId
exports.rejectKyc = async (req, res) => {
  try {
    const { type, driverId } = req.params;
    const { reason, adminNotes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const KycModel = getKycModel(type);
    if (!KycModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "owner" or "freelance"',
      });
    }

    const updatedKyc = await KycModel.findOneAndUpdate(
      { driverId },
      {
        status:          "Rejected",
        rejectionReason: reason,
        ...(adminNotes && { adminNotes }),
      },
      { new: true }
    );

    if (!updatedKyc) {
      return res.status(404).json({ success: false, message: "KYC not found" });
    }

    // ✅ Mark Driver.isKycComplete = false on rejection
    await Driver.findByIdAndUpdate(driverId, { isKycComplete: false });

    return res.json({
      success: true,
      message: "KYC Rejected",
      kycType: type,
      data:    updatedKyc,
    });
  } catch (error) {
    console.error("❌ rejectKyc error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN KYC DASHBOARD STATS ────────────────────────────────────────────────
// GET /api/admin/kyc/stats
exports.getKycStats = async (req, res) => {
  try {
    const [
      ownerPending,   ownerApproved,   ownerRejected,
      freelancePending, freelanceApproved, freelanceRejected, freelanceOwnerStepDone,
    ] = await Promise.all([
      OwnerKyc.countDocuments({ status: "Pending" }),
      OwnerKyc.countDocuments({ status: "Approved" }),
      OwnerKyc.countDocuments({ status: "Rejected" }),
      FreelanceKyc.countDocuments({ status: "Pending" }),
      FreelanceKyc.countDocuments({ status: "Approved" }),
      FreelanceKyc.countDocuments({ status: "Rejected" }),
      FreelanceKyc.countDocuments({ status: "Owner_Step_Done" }),
    ]);

    return res.json({
      success: true,
      stats: {
        owner: {
          pending:  ownerPending,
          approved: ownerApproved,
          rejected: ownerRejected,
          total:    ownerPending + ownerApproved + ownerRejected,
        },
        freelance: {
          pending:        freelancePending,
          ownerStepDone:  freelanceOwnerStepDone,
          approved:       freelanceApproved,
          rejected:       freelanceRejected,
          total:          freelancePending + freelanceOwnerStepDone + freelanceApproved + freelanceRejected,
        },
        overall: {
          pending:  ownerPending + freelancePending + freelanceOwnerStepDone,
          approved: ownerApproved + freelanceApproved,
          rejected: ownerRejected + freelanceRejected,
        },
      },
    });
  } catch (error) {
    console.error("❌ getKycStats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};