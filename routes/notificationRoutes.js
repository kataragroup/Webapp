const express = require('express');
const router = express.Router();

const notificationCtrl = require('../controllers/notificationController');

router.get('/my', notificationCtrl.getMyNotifications);

module.exports = router;