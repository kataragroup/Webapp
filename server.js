require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./sockets/socketHandler");

const app = express();

connectDB();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
    origin: "*",
  },
});

socketHandler(io);

app.set("io", io);

app.use("/api/driver", require("./routes/driverRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/kyc", require("./routes/kycRoutes"));
app.use("/api/admin/kyc", require("./routes/adminKycRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin/drivers", require("./routes/adminDriverRoutes"));
app.use("/api/call", require("./routes/callRoutes"));
app.use("/api/twiml", require("./routes/twimlRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

const PORT = process.env.PORT || 7000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});