require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;