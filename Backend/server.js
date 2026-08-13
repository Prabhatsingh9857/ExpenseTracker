import dns from "dns";

// Google DNS
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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
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