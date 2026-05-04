// sockets/socketHandler.js
const Driver = require("../models/Driver");

module.exports = (io) => {
  const onlineDrivers = new Map(); // driverId → socketId

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // ─── DRIVER REGISTERS ──────────────────────────────────────────────────
    socket.on("register-driver", ({ driverId }) => {
      if (!driverId) return;

      // Disconnect old socket if driver reconnects
      if (onlineDrivers.has(driverId)) {
        const oldSocketId = onlineDrivers.get(driverId);
        io.sockets.sockets.get(oldSocketId)?.disconnect();
      }

      onlineDrivers.set(driverId, socket.id);
      socket.driverId = driverId;

      console.log(`🚗 Driver ${driverId} registered (socket: ${socket.id})`);

      io.emit("driver-status", { driverId, isOnline: true });
    });

    // ─── DRIVER LOCATION UPDATE ────────────────────────────────────────────
    socket.on("update-location", async ({ lat, lng }) => {
      if (!socket.driverId) return;

      try {
        // Persist location to DB
        await Driver.findByIdAndUpdate(socket.driverId, {
          location: { type: "Point", coordinates: [lng, lat] },
          lastSeen: new Date(),
        });
      } catch (e) {
        console.error("Location update DB error:", e.message);
      }

      io.emit("driver-location", {
        driverId: socket.driverId,
        lat,
        lng,
        timestamp: new Date(),
      });
    });

    // ─── TEST RIDE REQUEST ────────────────────────────────────────────────
    socket.on("test-ride-request", (data) => {
      console.log("🧪 Test ride request:", data);

      const { driverId } = data;
      const driverSocketId = onlineDrivers.get(driverId);

      if (driverSocketId) {
        io.to(driverSocketId).emit("ride-request", data);
        console.log(`📤 Ride request sent to driver ${driverId}`);
      } else {
        io.emit("ride-request", data);
        console.log("📤 Ride request broadcast (driver not found in map)");
      }
    });

    // ─── MANUAL GO OFFLINE ────────────────────────────────────────────────
    socket.on("go-offline", async () => {
      const driverId = socket.driverId;
      if (!driverId) return;

      onlineDrivers.delete(driverId);

      try {
        await Driver.findByIdAndUpdate(driverId, {
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (e) {
        console.error("go-offline DB error:", e.message);
      }

      io.emit("driver-status", { driverId, isOnline: false });
      socket.disconnect();
    });

    // ─── DISCONNECT ────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      const driverId = socket.driverId;

      if (driverId && onlineDrivers.has(driverId)) {
        onlineDrivers.delete(driverId);

        console.log(`❌ Driver ${driverId} disconnected`);

        // ✅ Persist offline status to DB
        try {
          await Driver.findByIdAndUpdate(driverId, {
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (e) {
          console.error("disconnect DB error:", e.message);
        }

        io.emit("driver-status", { driverId, isOnline: false });
      }
    });
  });
};
