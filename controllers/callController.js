const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.makeCall = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Phone number required",
      });
    }

    const call = await client.calls.create({
      url: "http://13.206.124.146:7000/api/twiml", // 👈 FIXED ROUTE
      to: to, // driver number
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return res.json({
      success: true,
      message: "Calling driver...",
      callSid: call.sid,
    });

  } catch (error) {
    console.log("❌ Call error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};