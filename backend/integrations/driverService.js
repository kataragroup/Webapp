const axios = require('axios');

// Placeholder Driver Integration Service
// This file provides lightweight, integration-ready functions that call
// the external Driver App API. Keep implementation minimal here and
// handle retries/logging in a separate service layer if needed.

const DRIVER_API_BASE = process.env.DRIVER_API_BASE || 'http://localhost:5000/api/driver';
const DRIVER_API_KEY = process.env.DRIVER_API_KEY || null;

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (DRIVER_API_KEY) headers['x-api-key'] = DRIVER_API_KEY;
  return headers;
}

module.exports = {
  // Sends a ride request to the Driver App (returns driver candidates or request result)
  async sendRideRequest(ride) {
    // ride: { id, pickup, drop, fare, vehicleType, userId, meta }
    try {
      const res = await axios.post(`${DRIVER_API_BASE}/requests`, ride, { headers: getAuthHeaders(), timeout: 5000 });
      return res.data;
    } catch (err) {
      console.error('driverService.sendRideRequest error', err?.response?.data || err.message);
      throw err;
    }
  },

  // Query driver status by driverId
  async getDriverStatus(driverId) {
    try {
      const res = await axios.get(`${DRIVER_API_BASE}/${driverId}/status`, { headers: getAuthHeaders(), timeout: 3000 });
      return res.data;
    } catch (err) {
      console.error('driverService.getDriverStatus error', err?.response?.data || err.message);
      throw err;
    }
  },

  // Update ride status on Driver App side (optional / best-effort)
  async updateRideStatus(driverId, rideId, status) {
    try {
      const res = await axios.post(`${DRIVER_API_BASE}/${driverId}/rides/${rideId}/status`, { status }, { headers: getAuthHeaders(), timeout: 3000 });
      return res.data;
    } catch (err) {
      console.error('driverService.updateRideStatus error', err?.response?.data || err.message);
      throw err;
    }
  },

  // Notify Driver App that a ride was accepted by a specific driver (or ask driver to accept)
  async notifyRideAccepted(driverId, payload) {
    // payload: { rideId, eta, driverMeta }
    try {
      const res = await axios.post(`${DRIVER_API_BASE}/${driverId}/notify-accepted`, payload, { headers: getAuthHeaders(), timeout: 3000 });
      return res.data;
    } catch (err) {
      console.error('driverService.notifyRideAccepted error', err?.response?.data || err.message);
      throw err;
    }
  }
};
