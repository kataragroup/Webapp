const axios = require('axios');

const RIDE_BASE_URL = 'http://13.206.124.146:7000/api/rides';   

//====================  GET ACTIVE RIDE ====================
exports.getActiveRide = async (req, res) => {
  try {
    const response = await axios.get(`${RIDE_BASE_URL}/active`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Get active ride failed',
      error: error.response?.data || error.message
    });
  }
};

//====================  GET RIDE HISTORY ====================
exports.getRideHistory = async (req, res) => {
  try {

    const response = await axios.get(`${RIDE_BASE_URL}/history`, {
      headers: { Authorization: req.headers.authorization }
    });

    res.json(response.data);
  } catch (error) {
    //console.error(" Ride History Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Get ride history failed',
      error: error.response?.data || error.message
    });
  }
};

//====================  GET RIDE DETAILS ====================
exports.getRideDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${RIDE_BASE_URL}/${id}`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Ride Details Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Get ride details failed',
      error: error.response?.data || error.message
    });
  }
};

//====================  PAY FOR RIDE ====================
exports.payForRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const response = await axios.post(`${RIDE_BASE_URL}/${rideId}/pay`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Pay Ride Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Ride payment failed',
      error: error.response?.data || error.message
    });
  }
};