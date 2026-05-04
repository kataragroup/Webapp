<<<<<<< HEAD
=======
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

>>>>>>> e3152cd0b4bd64a3e0d1c4daa0d8f02cad52ca6d
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
=======
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
>>>>>>> e3152cd0b4bd64a3e0d1c4daa0d8f02cad52ca6d
    process.exit(1);
  }
};

module.exports = connectDB;