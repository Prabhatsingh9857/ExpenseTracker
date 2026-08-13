import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";

export async function getDashboardOverview(req, res) {
  const userId = req.user._id;

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  try {
    // Get current month's income
    const incomes = await incomeModel
      .find({
        userId,
        date: {
          $gte: startOfMonth,
          $lte: now,
        },
      })
      .lean();

    // Get current month's expenses
    const expenses = await expenseModel
      .find({
        userId,
        date: {
          $gte: startOfMonth,
          $lte: now,
        },
      })
      .lean();

    // Calculate monthly income
    const monthlyIncome = incomes.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0
    );

    // Calculate monthly expense
    const monthlyExpense = expenses.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0
    );

    // Calculate savings
    const savings = monthlyIncome - monthlyExpense;

    // Calculate savings rate
    const savingsRate =
      monthlyIncome === 0
        ? 0
        : Math.round((savings / monthlyIncome) * 100);

    // Get recent transactions
    const recentTransactions = [
      ...incomes.map((income) => ({
        ...income,
        type: "income",
      })),

      ...expenses.map((expense) => ({
        ...expense,
        type: "expense",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 10);

    // Calculate spending by category
    const spendByCategory = {};

    for (const expense of expenses) {
      const category = expense.category || "other";

      spendByCategory[category] =
        (spendByCategory[category] || 0) +
        Number(expense.amount || 0);
    }

    // Create expense distribution for chart
    const expenseDistribution = Object.entries(
      spendByCategory
    ).map(([category, amount]) => ({
      category,
      amount,
      percent:
        monthlyExpense === 0
          ? 0
          : Math.round(
              (amount / monthlyExpense) * 100
            ),
    }));

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpense,
        savings,
        savingsRate,
        recentTransactions,
        spendByCategory,
        expenseDistribution,
      },
    });
  } catch (error) {
    console.error(
      "GetDashboardOverview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
}