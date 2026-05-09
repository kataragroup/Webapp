const axios = require('axios');

const NOTIFICATION_BASE_URL = 'http://13.206.124.146:7000/api/notifications';

// Get My Notifications
exports.getMyNotifications = async (req, res) => {
  try {
    console.log("🔄 Fetching My Notifications...");

    const response = await axios.get(`${NOTIFICATION_BASE_URL}/my`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.json(response.data);

  } catch (error) {
    console.error("Notifications Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.response?.data || error.message
    });
  }
};