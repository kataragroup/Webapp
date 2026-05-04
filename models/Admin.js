// models/Admin.js
<<<<<<< HEAD

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SUB_ADMIN"],
      default: "SUPER_ADMIN",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
=======
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },

  password: String,

  role: {
    type: String,
    enum: ['owner','admin','support'],
    default: 'admin'
  }

}, { timestamps: true });

adminSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Admin', adminSchema);
>>>>>>> e3152cd0b4bd64a3e0d1c4daa0d8f02cad52ca6d
