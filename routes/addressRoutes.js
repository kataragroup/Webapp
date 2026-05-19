const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const {
  saveAddress,
  getSavedAddresses,
  deleteAddress,
} = require("../controllers/addressController");

router.post("/", userAuthMiddleware, saveAddress);
router.get("/", userAuthMiddleware, getSavedAddresses);
router.delete("/:addressId", userAuthMiddleware, deleteAddress);

module.exports = router;
