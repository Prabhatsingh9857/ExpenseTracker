import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense, getExpenseOverview, updateExpense } from '../controllers/expenseController.js';

const expenseRouter =express.Router();

// Add Expense
expenseRouter.post("/add", authMiddleware, addExpense);

// Get All Expense
expenseRouter.get("/get", authMiddleware, getAllExpense);

// Update Expense
expenseRouter.put("/update/:id", authMiddleware, updateExpense);

// Download Excel
expenseRouter.get("/downloadexcel", authMiddleware, downloadExpenseExcel);

// Delete Expense
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);

// Expense Overview
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;