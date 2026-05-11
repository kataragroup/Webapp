const express = require('express');
const router = express.Router();

const notificationCtrl = require('../controllers/notificationController');

router.post('/save-token', notificationCtrl.saveFcmToken);
router.get('/my', notificationCtrl.getMyNotifications);
router.put('/read/:id', notificationCtrl.markAsRead);

module.exports = router;