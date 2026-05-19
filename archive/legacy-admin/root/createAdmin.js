// createAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGO_URI or MONGODB_URI not set');
  process.exit(1);
}
mongoose.connect(uri);

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