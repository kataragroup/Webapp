require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const driverRoutes = require('./routes/driverRoutes');

const kycRoutes = require('./routes/kycRoutes');

const rideRoutes = require('./routes/rideRoutes');

const notificationRoutes = require('./routes/notificationRoutes');

const callRoutes = require('./routes/callRoutes');



const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Log all incoming requests (Helpful for debugging)
app.use((req, res, next) => {
  //console.log(` ${req.method} ${req.originalUrl}`);
  next();
});

// ====================== ROUTES ======================
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/web/auth', authRoutes);
app.use('/api/web/driver', driverRoutes);
app.use('/api/web/kyc', kycRoutes);
app.use('/api/web/rides', rideRoutes);   
app.use('/api/web/notifications', notificationRoutes);
app.use('/api/web/call', callRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found==: ${req.method} ${req.originalUrl}`
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(" Server running on port 5000");
});