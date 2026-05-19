const express = require("express");
const router  = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  goOnline,
  goOffline,
  getProfile,
  updateLocation,
  updateDriverType,
  getNearbyDrivers,
  getDriverById,
} = require("../controllers/driverControllers");

router.get("/nearby", getNearbyDrivers);
router.get("/:driverId", getDriverById);
router.post("/go-online",        authMiddleware, goOnline);
router.post("/go-offline",       authMiddleware, goOffline);
router.post("/update-location",  authMiddleware, updateLocation);
router.get("/profile",           authMiddleware, getProfile);
router.put("/type",              authMiddleware, updateDriverType);

module.exports = router;
