const express = require('express');
const router = express.Router();
const kycCtrl = require('../controllers/kycController');
const upload = require('../middleware/upload');

// Agar authMiddleware controllers folder mein hai toh:
const { authMiddleware } = require('../controllers/authController'); 

router.post('/freelance/step1', upload.fields([
    { name: 'ownerAadharFront', maxCount: 1 },
    { name: 'ownerAadharBack', maxCount: 1 },
    { name: 'ownerPanFront', maxCount: 1 },
    { name: 'ownerSelfie', maxCount: 1 },
    { name: 'agreementImage', maxCount: 1 },
    { name: 'lightbillImage', maxCount: 1 },
    { name: 'rcImage', maxCount: 1 },
    { name: 'insuranceImage', maxCount: 1 },
    { name: 'pucImage', maxCount: 1 }
]), kycCtrl.freelanceStep1);

router.post('/freelance/step2', upload.fields([
    { name: 'driverAadharFront', maxCount: 1 },
    { name: 'driverAadharBack', maxCount: 1 },
    { name: 'driverLicenceFront', maxCount: 1 },
    { name: 'driverLicenceBack', maxCount: 1 },
    { name: 'driverSelfie', maxCount: 1 }
]), kycCtrl.freelanceStep2);

router.get('/owner/status', authMiddleware, kycCtrl.getOwnerKycStatus);

module.exports = router;