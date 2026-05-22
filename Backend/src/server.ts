import express from "express";
import cors from "cors";
import { seedAdmin } from "./utils/seedAdmin";
// import { Request, Response, NextFunction } from 'express';
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

import path from "path";


const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// Health check
app.get("/", (req, res) => {
  res.send("API is running ");
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// Start server properly
const startServer = async () => {
  try {
    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
  }
};

startServer();