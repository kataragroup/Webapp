const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notificationCtrl = require('../controllers/notificationController');

router.post('/save-token', auth, notificationCtrl.saveFcmToken);
router.get('/my', auth, notificationCtrl.getMyNotifications);
router.put('/read/:id', auth, notificationCtrl.markAsRead);

module.exports = router;