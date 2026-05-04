// test-ride.js
const io = require("socket.io-client");

const socket = io("http://13.206.124.146:7000", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  
  socket.emit("test-ride-request", {
    driverId: "69f32463ea43599a862da1c5",
    pickup: { lat: 28.6139, lng: 77.2090, address: "Connaught Place" },
    drop: { lat: 28.6280, lng: 77.2190, address: "Karol Bagh" },
    vehicleType: "car",
    fare: 150,
    rideId: "TEST_123"
  });
});