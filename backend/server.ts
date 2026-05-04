import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { connectDB, db } from "./data/store";

// Import Routes
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import driverRoutes from "./routes/driver";
import rideRoutes from "./routes/ride";

async function startServer() {
  await connectDB();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: db ? "mongodb" : "memory",
      mapsKey: !!process.env.VITE_GOOGLE_MAPS_API_KEY
    });
  });

  // Register Modules
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/drivers", driverRoutes);
  app.use("/api/rides", rideRoutes);

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Production-ready server running on http://localhost:${PORT}`);
  });
}

startServer();
