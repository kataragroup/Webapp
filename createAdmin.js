// createAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const hash = await bcrypt.hash("kataragroup#@!", 10);

  await Admin.create({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: hash,
    role: "SUPER_ADMIN",
  });

  console.log("✅ Admin Created");
  process.exit();
})();