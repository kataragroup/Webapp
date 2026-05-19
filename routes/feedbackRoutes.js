const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const { submitFeedback } = require("../controllers/feedbackController");

router.post("/", userAuthMiddleware, submitFeedback);

module.exports = router;
