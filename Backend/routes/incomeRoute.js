import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  addIncome,
  deleteIncome,
  downloadIncomeExcell,
  getAllIncome,
  getIncomeOverview,
  updateIncome,
} from "../controllers/incomeController.js";

const incomeRouter = express.Router();

// Add Income
incomeRouter.post("/add", authMiddleware, addIncome);

// Get All Income
incomeRouter.get("/get", authMiddleware, getAllIncome);

// Update Income
incomeRouter.put("/update/:id", authMiddleware, updateIncome);

// Download Excel
incomeRouter.get("/downloadexcel", authMiddleware, downloadIncomeExcell);

// Delete Income
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);

// Income Overview
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

export default incomeRouter;