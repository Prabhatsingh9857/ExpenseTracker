import dns from "dns";

// ======================================================
// DNS
// ======================================================

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import userRouter from "./routes/userRoute.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

dotenv.config();

// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();

const PORT = process.env.PORT || 4000;

// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://expensetracker-41xa.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================================
// BASIC TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is working",
  });
});

// ======================================================
// API ROUTES
// ======================================================

// User / Authentication
app.use(
  "/api/user",
  userRouter
);

// Income
app.use(
  "/api/income",
  incomeRouter
);

// Expense
app.use(
  "/api/expense",
  expenseRouter
);

// Dashboard
app.use(
  "/api/dashboard",
  dashboardRouter
);

// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start Express
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

// ======================================================
// RUN SERVER
// ======================================================

startServer();