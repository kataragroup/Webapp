const express = require('express');
const router = express.Router();

const rideCtrl = require('../controllers/rideController');

router.get('/active', rideCtrl.getActiveRide);

router.get('/history', rideCtrl.getRideHistory);

router.get('/:id', rideCtrl.getRideDetails);

router.post('/:rideId/pay', rideCtrl.payForRide);

module.exports = router;