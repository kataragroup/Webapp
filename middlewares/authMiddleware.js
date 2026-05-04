const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");

// 🔐 Driver Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lookup in Driver collection (this is a driver app)
    const driver = await Driver.findById(decoded.id);
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Driver not found.",
      });
    }

    req.user   = driver; // keep req.user for backward compat with kycController
    req.driver = driver; // also expose as req.driver
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
