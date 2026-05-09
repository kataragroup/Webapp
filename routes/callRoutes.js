const express = require('express');
const router = express.Router();

const callCtrl = require('../controllers/callController');

router.post('/call', callCtrl.makeCall);           // → /api/web/call/call

router.post('/twiml', callCtrl.twimlResponse);     // → /api/web/call/twiml

module.exports = router;