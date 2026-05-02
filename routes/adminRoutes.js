// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// PUBLIC
router.post('/login', adminCtrl.login);

// PROTECTED
router.post('/register', adminCtrl.register);
router.get('/dashboard', auth, admin, adminCtrl.dashboard);
router.get('/users', auth, admin, adminCtrl.getUsers);
router.put('/user/block/:id', auth, admin, adminCtrl.blockUser);

router.get('/drivers', auth, admin, adminCtrl.getDrivers);
router.put('/driver/approve/:id', auth, admin, adminCtrl.approveDriver);

router.get('/rides', auth, admin, adminCtrl.getRides);

module.exports = router;