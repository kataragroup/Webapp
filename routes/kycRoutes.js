const express = require('express');
const router = express.Router();
const kycCtrl = require('../controllers/kycController');
const { authMiddleware } = require('../controllers/authController');
const upload = require('../middleware/upload');
//const upload = require('../config/multer');

// Owner Driver KYC
router.post(
  '/owner/submit',
  upload.fields([
    { name: 'aadharFront' },
    { name: 'aadharBack' },
    { name: 'panFront' },
    { name: 'licenceFront' },
    { name: 'licenceBack' },
    { name: 'profileImage' },
    { name: 'agreementImage' },
    //{ name: 'lightbillImage' },
    { name: 'rcImage' },
    { name: 'insuranceImage' },
    { name: 'pucImage' }
  ]),
  kycCtrl.ownerSubmit
);

//console.log("authMiddleware =", authMiddleware);
//console.log("getOwnerKycStatus =", kycCtrl.getOwnerKycStatus);

// Get Owner KYC Status
router.get(
  '/owner/status',
  authMiddleware,
  kycCtrl.getOwnerKycStatus
);

// Owner Driver KYC Step 1 for Freelance Drivers
router.post(
  '/freelance/step1',
  upload.fields([
    { name: 'ownerAadharFront', maxCount: 1 },
    { name: 'ownerAadharBack', maxCount: 1 },
    { name: 'ownerPanFront', maxCount: 1 },
    { name: 'ownerSelfie', maxCount: 1 },
    { name: 'agreementImage', maxCount: 1 },
    { name: 'lightbillImage', maxCount: 1 },
    { name: 'rcImage', maxCount: 1 },
    { name: 'insuranceImage', maxCount: 1 },
    { name: 'pucImage', maxCount: 1 }
  ]),
  kycCtrl.freelanceStep1
);

// Owner Driver KYC Step 2 for Freelance Drivers
router.post(
  '/freelance/step2',
  upload.fields([
    { name: 'driverAadharFront' },
    { name: 'driverAadharBack' },
    { name: 'driverLicenceFront' },
    { name: 'driverLicenceBack' },
    { name: 'driverSelfie' }
  ]),
  kycCtrl.freelanceStep2
);

module.exports = router;