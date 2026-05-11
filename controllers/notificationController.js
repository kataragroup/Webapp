const axios = require('axios');
const NOTIFICATION_BASE_URL = process.env.NOTIFICATION_BASE_URL;

// ====================== GET MY NOTIFICATIONS ======================
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

// ====================== SAVE FCM TOKEN ======================
exports.saveFcmToken = async (req, res) => {
  try {
    console.log("Saving FCM Token... Body:", req.body);
    const response = await axios.post(
      `${NOTIFICATION_BASE_URL}/save-token`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Save FCM Token Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to save FCM token",
      error: error.response?.data || error.message
    });
  }
};


// ====================== MARK NOTIFICATION AS READ ======================
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required"
      });
    }
    console.log(`🔄 Marking notification ${id} as read...`);
    const response = await axios.put(
      `${NOTIFICATION_BASE_URL}/read/${id}`,
      req.body || {},
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Mark As Read Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.response?.data || error.message
    });
  }
};