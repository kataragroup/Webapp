const Address = require("../models/Address");

exports.saveAddress = async (req, res) => {
  try {
    const { label, address, coordinates } = req.body;

    if (!label || !address) {
      return res.status(400).json({ success: false, message: "label and address are required" });
    }

    const saved = await Address.create({
      userId: req.user._id,
      label,
      address,
      coordinates: Array.isArray(coordinates) ? coordinates : [],
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("❌ saveAddress error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSavedAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: addresses.length, data: addresses });
  } catch (error) {
    console.error("❌ getSavedAddresses error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.addressId, userId: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    return res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error("❌ deleteAddress error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
