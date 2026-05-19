require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./backend/sockets/socketHandler");

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"]
  },
});

socketHandler(io);

app.set("io", io);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/driver", require("./routes/driverRoutes"));
app.use("/api/rides", require("./routes/rideRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/kyc", require("./routes/kycRoutes"));
app.use("/api/admin/kyc", require("./routes/adminKycRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin/drivers", require("./routes/adminDriverRoutes"));
app.use("/api/call", require("./routes/callRoutes"));
app.use("/api/twiml", require("./routes/twimlRoutes"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 API Running Successfully"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found"
  });
});

const PORT = process.env.PORT || 7000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});