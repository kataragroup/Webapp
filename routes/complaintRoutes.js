const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const { submitComplaint } = require("../controllers/complaintController");

router.post("/", userAuthMiddleware, submitComplaint);

module.exports = router;
