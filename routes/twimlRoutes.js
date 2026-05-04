const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.type("text/xml");

  const { to } = req.body; // driver number

  res.send(`
    <Response>
      <Dial>${to}</Dial>
    </Response>
  `);
});

module.exports = router;