const express = require("express");
const router  = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  goOnline,
  goOffline,
  getProfile,
  updateLocation,
  updateDriverType,
} = require("../controllers/driverControllers");

// All driver routes are protected — driver must be logged in
router.post("/go-online",        authMiddleware, goOnline);
router.post("/go-offline",       authMiddleware, goOffline);
router.post("/update-location",  authMiddleware, updateLocation);
router.get("/profile",           authMiddleware, getProfile);
router.put("/type",              authMiddleware, updateDriverType);

module.exports = router;