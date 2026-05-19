const express = require("express");
const router = express.Router();

const { makeCall } = require("../controllers/callController");

router.post("/", makeCall);

module.exports = router;