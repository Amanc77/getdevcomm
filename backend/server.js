const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://getdevcomm.vercel.app",
  "https://www.getdevcomm.vercel.app",
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin.includes("vercel.app")) {
        // Allow all Vercel preview deployments
        callback(null, true);
      } else if (origin.includes("netlify.app")) {
        // Allow Netlify deployments if needed
        callback(null, true);
      } else {
        // In development, allow localhost with any port
        if (
          process.env.NODE_ENV !== "production" &&
          origin.startsWith("http://localhost:")
        ) {
          callback(null, true);
        } else {
          // Log blocked origin for debugging
          console.warn(" CORS blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devlinker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/communities", require("./routes/communities"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "DevLinker API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
