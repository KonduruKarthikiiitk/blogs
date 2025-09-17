const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

const app = express();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is required!");
  process.exit(1);
}

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
});
app.use(limiter);

// CORS configuration - Simplified for Vercel deployment
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true // Allow same-origin requests in production
        : "*", // Allow all origins in development
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// Database connection
const mongoUri = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  MONGODB_URI not found in environment variables. Using default local MongoDB."
  );
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasMongoURI: !!process.env.MONGODB_URI,
  });
});

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server only if not in Vercel environment
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Access from mobile: http://192.168.0.25:${PORT}/api`);
  });
} else {
  console.log("Running in Vercel environment");
  console.log("JWT_SECRET available:", !!process.env.JWT_SECRET);
  console.log("MONGODB_URI available:", !!process.env.MONGODB_URI);
}

// Debug logging for Vercel
console.log("Backend server loaded");
console.log("JWT_SECRET available:", !!process.env.JWT_SECRET);
console.log("MONGODB_URI available:", !!process.env.MONGODB_URI);

// Export for Vercel
module.exports = app;
