const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const {
  createRide,
  getRideHistory,
  getRideById,
  updateRideStatus,
  cancelRide,
  completeRide,
} = require("../controllers/rideController");

router.post("/", userAuthMiddleware, createRide);
router.get("/history", userAuthMiddleware, getRideHistory);
router.get("/:rideId", userAuthMiddleware, getRideById);
router.patch("/:rideId/status", userAuthMiddleware, updateRideStatus);
router.patch("/:rideId/cancel", userAuthMiddleware, cancelRide);
router.patch("/:rideId/complete", userAuthMiddleware, completeRide);

module.exports = router;
