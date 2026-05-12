const axios = require('axios');

const CALL_BASE_URL = 'http://13.206.124.146:7000/api';

// ====================== MAKE CALL ======================
exports.makeCall = async (req, res) => {
  try {
    console.log("Make Call Request Body:", req.body);

    const response = await axios.post(
      'http://13.206.124.146:7000/api/call/call', 
      req.body, 
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Make Call Failed:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Make call failed",
      error: error.response?.data || error.message
    });
  }
};

// ====================== TwiML RESPONSE ======================
exports.twimlResponse = async (req, res) => {
  try {
    console.log(" TwiML Response Proxy");

    const response = await axios.post(`${CALL_BASE_URL}/twiml`, req.body);

    res.json(response.data);
  } catch (error) {
    console.error("TwiML Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "TwiML response failed",
      error: error.response?.data || error.message
    });
  }
};

// ====================== INITIATE MASKED CALL ======================
exports.initiateMaskedCall = async (req, res) => {
  try {
    console.log(" Initiate Masked Call - Body:", req.body);

    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "rideId is required"
      });
    }

    const response = await axios.post(
      'http://13.206.124.146:7000/api/call/call',   
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Masked Call Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to initiate masked call",
      error: error.response?.data || error.message
    });
  }
};