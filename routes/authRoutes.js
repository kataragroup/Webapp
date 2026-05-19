const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const {
  register,
  login,
  verifyOtp,
  getMe,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyOtp);
router.get("/me", userAuthMiddleware, getMe);
router.put("/profile", userAuthMiddleware, updateProfile);

module.exports = router;
