const axios = require('axios');

const DRIVER_URL = 'http://13.206.124.146:7000/api/driver';

exports.getDriver = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { driverType } = req.body;

    if (!token) return res.status(401).json({ message: "Authorization token missing" });

    const response = await axios.post(
      'http://13.206.124.146:7000/api/driver/type',
      { driverType },
      { headers: { Authorization: token } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Get Driver Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Driver API failed",
      error: error.response?.data || error.message
    });
  }
};

// ====================  GO ONLINE ====================
exports.goOnline = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const response = await axios.post(
      'http://13.206.124.146:7000/api/driver/go-online',
      req.body,
      {
        headers: { Authorization: token },
        timeout: 15000
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Go Online Error Details:", {
      status: error.response?.status,
      data: error.response?.data
    });

    res.status(500).json({
      success: false,
      message: 'Go online failed',
      error: error.response?.data || error.message
    });
  }
};

// ====================  GO OFFLINE ====================
//Driver Go Offline
exports.goOffline = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token missing" });
    }

    const response = await axios.post(
      'http://13.206.124.146:7000/api/driver/go-offline',
      req.body || {},           // Send empty body if nothing needed
      {
        headers: {
          Authorization: token
        },
        timeout: 15000
      }
    );

    console.log("Go Offline Success:", response.data);
    res.json(response.data);

  } catch (error) {
    console.error(" Go Offline Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    res.status(500).json({
      success: false,
      message: 'Go offline failed',
      error: error.response?.data || error.message
    });
  }
};
 // ====================  UPDATE LOCATION ====================
exports.updateLocation = async (req, res) => {
  try {

    const response = await axios.post(
      `${DRIVER_URL}/update-location`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Update location failed',
      error: error.response?.data || error.message
    });

  }
};

// ====================  GET PROFILE ====================
exports.getProfile = async (req, res) => {

  try {

    const response = await axios.get(
      `${DRIVER_URL}/profile`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Get profile failed',
      error: error.response?.data || error.message
    });

  }

};

// ====================  UPDATE DRIVER TYPE ====================
exports.updateDriverType = async (req, res) => {

  try {

    const response = await axios.put(
      `${DRIVER_URL}/type`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Update driver type failed',
      error: error.response?.data || error.message
    });

  }

};

// ====================  GET EARNINGS ====================
exports.getEarnings = async (req, res) => {

  try {

    const response = await axios.get(
      `${DRIVER_URL}/earnings`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Get earnings failed',
      error: error.response?.data || error.message
    });

  }

};