// controllers/adminController.js
const Admin = require('../models/Admin');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.json({ status: false, message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.json({ status: false, message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    status: true,
    message: "Login success",
    token
  });
};

// REGISTER ADMIN
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await Admin.findOne({ email });
  if (exist) {
    return res.json({ status: false, message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: "admin"
  });

  res.json({
    status: true,
    message: "Admin created",
    admin
  });
};

/*
// DASHBOARD
exports.dashboard = async (req, res) => {
  const users = await User.countDocuments();
  const drivers = await Driver.countDocuments();
  const rides = await Ride.countDocuments();

  res.json({ users, drivers, rides });
};

// GET USERS
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
};

// GET DRIVERS
exports.getDrivers = async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
};

// APPROVE DRIVER
exports.approveDriver = async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  res.json(driver);
};

// GET RIDES
exports.getRides = async (req, res) => {
  const rides = await Ride.find()
    .populate('userId')
    .populate('driverId');
  res.json(rides);
}; 
*/