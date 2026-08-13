import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  RefreshCw,
  Info,
  PieChart as PieChartIcon,
  ArrowDownRight,
  Clock3,
  Plus,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import AddTransactionModal from "../components/Add.jsx";
import GaugeCard from "../components/GaugeCard";

// ======================================================
// COLORS
// ======================================================

const COLORS = [
  "#14b8a6",
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
  "#eab308",
  "#ef4444",
];

// ======================================================
// HELPERS
// ======================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ------------------------------------------------------
// Parse amount safely
// ------------------------------------------------------

const parseAmount = (value) => {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
};

// ------------------------------------------------------
// Format money
// ------------------------------------------------------

const formatMoney = (value) => {
  return Math.round(Number(value || 0)).toLocaleString("en-IN");
};

// ------------------------------------------------------
// Parse date safely
// ------------------------------------------------------

const parseDate = (date) => {
  if (!date) return null;

  // Handles YYYY-MM-DD without UTC shifting
  if (
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0,
      0
    );
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

// ------------------------------------------------------
// Format date
// ------------------------------------------------------

const formatDate = (date) => {
  const parsed = parseDate(date);

  if (!parsed) return "";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ======================================================
// CURRENT TIME FRAME
// ======================================================

const getTimeFrameRange = (timeFrame) => {
  const now = new Date();

  let start;
  let end;
  let label;

  // DAILY
  if (timeFrame === "daily") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);

    end = new Date(now);
    end.setHours(23, 59, 59, 999);

    label = "Today";
  }

  // WEEKLY
  else if (timeFrame === "weekly") {
    start = new Date(now);

    const day = start.getDay();

    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    label = "This Week";
  }

  // MONTHLY
  else {
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    label = "This Month";
  }

  return {
    start,
    end,
    label,
  };
};

// ======================================================
// PREVIOUS TIME FRAME
// ======================================================

const getPreviousTimeFrameRange = (timeFrame) => {
  const now = new Date();

  // DAILY
  if (timeFrame === "daily") {
    const start = new Date(now);

    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
      label: "Yesterday",
    };
  }

  // WEEKLY
  if (timeFrame === "weekly") {
    const start = new Date(now);

    const day = start.getDay();

    start.setDate(start.getDate() - day - 7);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);

    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
      label: "Last Week",
    };
  }

  // MONTHLY
  const start = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
    0
  );

  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  return {
    start,
    end,
    label: "Last Month",
  };
};

// ======================================================
// DATE RANGE CHECK
// ======================================================

const isDateInRange = (date, start, end) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) return false;

  return parsedDate >= start && parsedDate <= end;
};

// ======================================================
// CALCULATE DATA
// ======================================================

const calculateData = (transactions = []) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach((transaction) => {
    const amount = parseAmount(transaction.amount);

    if (transaction.type === "income") {
      income += amount;
    }

    if (transaction.type === "expense") {
      expenses += amount;
    }
  });

  const savings = income - expenses;

  const savingsRate =
    income > 0
      ? Math.round((savings / income) * 100)
      : 0;

  return {
    income,
    expenses,
    savings,
    savingsRate,
  };
};

// ======================================================
// DASHBOARD
// ======================================================

const Dashboard = () => {
  const outletContext = useOutletContext() || {};

  const {
    allTransactions = [],
    stats = {},
    loading = false,
    timeFrame = "monthly",
    setTimeFrame = () => {},
    addTransaction = null,
    refreshTransactions = null,
  } = outletContext;

  // ====================================================
  // MODAL
  // ====================================================

  const [showModal, setShowModal] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    date: getToday(),
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  });

  // ====================================================
  // CURRENT RANGE
  // ====================================================

  const currentRange = useMemo(
    () => getTimeFrameRange(timeFrame),
    [timeFrame]
  );

  // ====================================================
  // PREVIOUS RANGE
  // ====================================================

  const previousRange = useMemo(
    () => getPreviousTimeFrameRange(timeFrame),
    [timeFrame]
  );

  // ====================================================
  // CURRENT TRANSACTIONS
  // ====================================================

  const currentTransactions = useMemo(() => {
    return allTransactions.filter((transaction) =>
      isDateInRange(
        transaction.date,
        currentRange.start,
        currentRange.end
      )
    );
  }, [allTransactions, currentRange]);

  // ====================================================
  // PREVIOUS TRANSACTIONS
  // ====================================================

  const previousTransactions = useMemo(() => {
    return allTransactions.filter((transaction) =>
      isDateInRange(
        transaction.date,
        previousRange.start,
        previousRange.end
      )
    );
  }, [allTransactions, previousRange]);

  // ====================================================
  // CURRENT DATA
  // ====================================================

  const currentData = useMemo(
    () => calculateData(currentTransactions),
    [currentTransactions]
  );

  // ====================================================
  // PREVIOUS DATA
  // ====================================================

  const previousData = useMemo(
    () => calculateData(previousTransactions),
    [previousTransactions]
  );

  // ====================================================
  // ALL TIME DATA
  // ====================================================

  const allTimeData = useMemo(
    () => calculateData(allTransactions),
    [allTransactions]
  );

  // ====================================================
  // MAIN VALUES
  // ====================================================

  const totalBalance =
    allTransactions.length > 0
      ? allTimeData.savings
      : parseAmount(stats.allTimeIncome) -
        parseAmount(stats.allTimeExpenses);

  const currentIncome = currentData.income;
  const currentExpense = currentData.expenses;
  const currentSavings = currentData.savings;
  const savingRate = currentData.savingsRate;

  // ====================================================
  // INCOME CHANGE
  // ====================================================

  const incomeChange = useMemo(() => {
    const current = currentData.income;
    const previous = previousData.income;

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(
      ((current - previous) / previous) * 100
    );
  }, [currentData, previousData]);

  // ====================================================
  // EXPENSE CHANGE
  // ====================================================

  const expenseChange = useMemo(() => {
    const current = currentData.expenses;
    const previous = previousData.expenses;

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(
      ((current - previous) / previous) * 100
    );
  }, [currentData, previousData]);

  // ====================================================
  // RECENT TRANSACTIONS
  // ====================================================

  const recentTransactions = useMemo(() => {
    return [...allTransactions]
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        return (
          (dateB?.getTime() || 0) -
          (dateA?.getTime() || 0)
        );
      })
      .slice(0, 5);
  }, [allTransactions]);

  // ====================================================
  // CURRENT INCOME TRANSACTIONS
  // ====================================================

  const recentIncome = useMemo(() => {
    return [...currentTransactions]
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        return (
          (dateB?.getTime() || 0) -
          (dateA?.getTime() || 0)
        );
      })
      .slice(0, 5);
  }, [currentTransactions]);

  // ====================================================
  // CURRENT EXPENSE TRANSACTIONS
  // ====================================================

  const recentExpenses = useMemo(() => {
    return [...currentTransactions]
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        return (
          (dateB?.getTime() || 0) -
          (dateA?.getTime() || 0)
        );
      })
      .slice(0, 5);
  }, [currentTransactions]);

  // ====================================================
  // CATEGORY DATA
  // ====================================================

  const categoryData = useMemo(() => {
    const categories = {};

    currentTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category || "Other";

        categories[category] =
          (categories[category] || 0) +
          parseAmount(transaction.amount);
      });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
      }))
      .sort((a, b) => b.value - a.value);
  }, [currentTransactions]);

  // ====================================================
  // ADD TRANSACTION
  // ====================================================

  const handleAddTransaction = async () => {
    if (!addTransaction) {
      alert(
        "Transaction service is not available. Check your Layout component."
      );
      return;
    }

    const amount = Number(
      newTransaction.amount
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (
      !newTransaction.description.trim()
    ) {
      alert("Please enter a description.");
      return;
    }

    if (!newTransaction.date) {
      alert("Please select a date.");
      return;
    }

    try {
      await addTransaction({
        ...newTransaction,
        description:
          newTransaction.description.trim(),
        amount,
      });

      setShowModal(false);

      setNewTransaction({
        date: getToday(),
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });

      if (refreshTransactions) {
        await refreshTransactions();
      }
    } catch (error) {
      console.error(
        "Add transaction error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add transaction."
      );
    }
  };

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = async () => {
    if (!refreshTransactions) return;

    try {
      await refreshTransactions();
    } catch (error) {
      console.error(
        "Refresh error:",
        error
      );
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f5f7f9]">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600" />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#f5f7f9] px-4 py-5 sm:px-6 lg:px-7">

      {/* ==================================================
          MAIN TWO COLUMN LAYOUT
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)]">

        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className="min-w-0">

          {/* ==================================================
              FINANCIAL OVERVIEW
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <BarChart3 className="h-6 w-6 text-teal-500" />

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-bold text-[#172033]">
                    Financial Overview
                  </h2>

                  <span className="text-sm text-gray-500">
                    ({currentRange.label})
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-teal-600"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>

            </div>

            {/* ==================================================
                FINANCE DASHBOARD BANNER
            ================================================== */}

            <div className="mx-5 mb-5 rounded-2xl bg-cyan-50 px-6 py-6 sm:mx-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                <div>

                  <h1 className="text-3xl font-bold text-teal-700">
                    Finance Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-gray-600">
                    Track your income and expenses
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </button>

              </div>

              {/* TIME FRAME */}

              <div className="mt-7 flex justify-end">

                <div className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">

                  <button
                    type="button"
                    onClick={() =>
                      setTimeFrame("daily")
                    }
                    className={`rounded-md px-5 py-2 text-sm ${
                      timeFrame === "daily"
                        ? "bg-teal-500 font-semibold text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Daily
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTimeFrame("weekly")
                    }
                    className={`rounded-md px-5 py-2 text-sm ${
                      timeFrame === "weekly"
                        ? "bg-teal-500 font-semibold text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Weekly
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTimeFrame("monthly")
                    }
                    className={`rounded-md px-5 py-2 text-sm ${
                      timeFrame === "monthly"
                        ? "bg-teal-500 font-semibold text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Monthly
                  </button>

                </div>

              </div>

            </div>

            {/* ==================================================
                THREE SUMMARY CARDS
            ================================================== */}

            <div className="px-5 pb-5 sm:px-6">

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                {/* TOTAL BALANCE */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                      <Wallet className="h-5 w-5 text-cyan-600" />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                      Total Balance
                    </p>

                  </div>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      totalBalance < 0
                        ? "text-red-600"
                        : "text-[#172033]"
                    }`}
                  >
                    {totalBalance < 0
                      ? "-"
                      : ""}
                    ₹
                    {formatMoney(
                      Math.abs(totalBalance)
                    )}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-teal-700">
                      +₹
                      {formatMoney(
                        currentIncome
                      )}
                    </span>

                    <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
                      -₹
                      {formatMoney(
                        currentExpense
                      )}
                    </span>

                  </div>

                </div>

                {/* EXPENSE */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                      <ArrowDownRight className="h-5 w-5 text-orange-600" />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                      {currentRange.label} Expenses
                    </p>

                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-[#172033]">
                    ₹
                    {formatMoney(
                      currentExpense
                    )}
                  </h3>

                  <p className="mt-2 flex items-center gap-1 text-xs">

                    {expenseChange >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-teal-600" />
                    )}

                    <span
                      className={
                        expenseChange > 0
                          ? "text-orange-600"
                          : "text-teal-600"
                      }
                    >
                      {Math.abs(
                        expenseChange
                      )}
                      %{" "}
                      {expenseChange >= 0
                        ? "increase"
                        : "decrease"}{" "}
                      from{" "}
                      <span className="font-semibold">
                        {previousRange.label}
                      </span>
                    </span>

                  </p>

                </div>

                {/* SAVINGS */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                      <PiggyBank className="h-5 w-5 text-cyan-600" />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                      {currentRange.label} Savings
                    </p>

                  </div>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      currentSavings < 0
                        ? "text-red-600"
                        : "text-[#172033]"
                    }`}
                  >
                    {currentSavings < 0
                      ? "-"
                      : ""}
                    ₹
                    {formatMoney(
                      Math.abs(
                        currentSavings
                      )
                    )}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="text-xs text-gray-500">
                      {savingRate}% of income
                    </span>

                    <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-teal-700">
                      {savingRate}%
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              GAUGE CARDS
          ================================================== */}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

            <GaugeCard
              gauge={{
                name: "Income",
                value: currentIncome,
                max: Math.max(
                  currentIncome,
                  currentExpense,
                  1
                ),
              }}
              colorInfo={{
                gradientStart: "#14b8a6",
                gradientEnd: "#06b6d4",
                textColor: "#172033",
              }}
              timeFrameLabel={
                currentRange.label
              }
            />

            <GaugeCard
              gauge={{
                name: "Spent",
                value: currentExpense,
                max: Math.max(
                  currentIncome,
                  currentExpense,
                  1
                ),
              }}
              colorInfo={{
                gradientStart: "#f97316",
                gradientEnd: "#ef4444",
                textColor: "#172033",
              }}
              timeFrameLabel={
                currentRange.label
              }
            />

            <GaugeCard
              gauge={{
                name: "Savings",
                value: currentSavings,
                max: Math.max(
                  currentIncome,
                  1
                ),
              }}
              colorInfo={{
                gradientStart: "#14b8a6",
                gradientEnd: "#3b82f6",
                textColor: "#172033",
              }}
              timeFrameLabel={
                currentRange.label
              }
              highlightNegative={true}
            />

          </div>

          {/* ==================================================
              EXPENSE DISTRIBUTION
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 px-5 py-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50">
                <PieChartIcon className="h-5 w-5 text-cyan-600" />
              </div>

              <div className="flex items-center gap-2">

                <h2 className="text-lg font-bold text-[#172033]">
                  Expense Distribution
                </h2>

                <span className="text-sm text-gray-500">
                  ({currentRange.label})
                </span>

              </div>

            </div>

            {categoryData.length === 0 ? (

              <div className="flex h-72 flex-col items-center justify-center">

                <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-gray-100">

                  <div className="h-20 w-20 rounded-full border-8 border-gray-50" />

                </div>

                <p className="mt-5 text-sm text-gray-400">
                  No expense data available
                </p>

              </div>

            ) : (

              <div className="h-80 px-5 pb-5">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="45%"
                      innerRadius={75}
                      outerRadius={115}
                      paddingAngle={3}
                      dataKey="value"
                    >

                      {categoryData.map(
                        (entry, index) => (
                          <Cell
                            key={`distribution-${entry.name}-${index}`}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₹${formatMoney(value)}`
                      }
                    />

                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: "12px",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

          {/* ==================================================
              RECENT INCOME
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between px-5 py-5">

              <div className="flex items-center gap-3">

                <TrendingUp className="h-6 w-6 text-emerald-500" />

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-[#172033]">
                    Recent Income
                  </h2>

                  <span className="text-sm text-gray-500">
                    ({currentRange.label})
                  </span>

                </div>

              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {recentIncome.length} records
              </span>

            </div>

            {recentIncome.length === 0 ? (

              <div className="flex min-h-52 flex-col items-center justify-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">

                  <DollarSign className="h-8 w-8 text-emerald-500" />

                </div>

                <p className="text-sm font-semibold text-gray-600">
                  No income transactions
                </p>

              </div>

            ) : (

              <div className="space-y-3 px-5 pb-5">

                {recentIncome.map(
                  (transaction, index) => (

                    <div
                      key={
                        transaction._id ||
                        transaction.id ||
                        `income-${index}`
                      }
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">

                          <TrendingUp className="h-4 w-4 text-emerald-600" />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-gray-700">
                            {transaction.description ||
                              "Income"}
                          </p>

                          <p className="text-xs text-gray-400">

                            {transaction.category ||
                              "Other"}

                            {" • "}

                            {formatDate(
                              transaction.date
                            )}

                          </p>

                        </div>

                      </div>

                      <p className="ml-3 shrink-0 text-sm font-semibold text-emerald-600">
                        +₹
                        {formatMoney(
                          Math.abs(
                            parseAmount(
                              transaction.amount
                            )
                          )
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* ==================================================
              RECENT EXPENSES
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between px-5 py-5">

              <div className="flex items-center gap-3">

                <ArrowDownRight className="h-6 w-6 text-orange-500" />

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-[#172033]">
                    Recent Expenses
                  </h2>

                  <span className="text-sm text-gray-500">
                    ({currentRange.label})
                  </span>

                </div>

              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {recentExpenses.length} records
              </span>

            </div>

            {recentExpenses.length === 0 ? (

              <div className="flex min-h-52 flex-col items-center justify-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">

                  <ShoppingCart className="h-8 w-8 text-orange-500" />

                </div>

                <p className="text-sm font-semibold text-gray-600">
                  No expense transactions
                </p>

              </div>

            ) : (

              <div className="space-y-3 px-5 pb-5">

                {recentExpenses.map(
                  (transaction, index) => (

                    <div
                      key={
                        transaction._id ||
                        transaction.id ||
                        `expense-${index}`
                      }
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50">

                          <ShoppingCart className="h-4 w-4 text-orange-500" />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-gray-700">
                            {transaction.description ||
                              "Expense"}
                          </p>

                          <p className="text-xs text-gray-400">

                            {transaction.category ||
                              "Other"}

                            {" • "}

                            {formatDate(
                              transaction.date
                            )}

                          </p>

                        </div>

                      </div>

                      <p className="ml-3 shrink-0 text-sm font-semibold text-orange-600">
                        -₹
                        {formatMoney(
                          Math.abs(
                            parseAmount(
                              transaction.amount
                            )
                          )
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="space-y-4">

          {/* ==================================================
              RECENT TRANSACTIONS
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between px-5 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50">
                  <Clock3 className="h-5 w-5 text-purple-500" />
                </div>

                <h2 className="text-lg font-bold text-[#172033]">
                  Recent Transactions
                </h2>

              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>

            </div>

            <div className="mx-5 rounded-lg bg-blue-50 px-3 py-2">

              <div className="flex items-center gap-2">

                <Info className="h-4 w-4 text-blue-500" />

                <span className="text-xs text-gray-500">
                  Transactions are stacked by date (newest first)
                </span>

              </div>

            </div>

            {recentTransactions.length === 0 ? (

              <div className="flex min-h-56 flex-col items-center justify-center px-5">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">

                  <Clock3 className="h-8 w-8 text-purple-500" />

                </div>

                <p className="text-sm font-semibold text-gray-600">
                  No recent transactions
                </p>

              </div>

            ) : (

              <div className="space-y-3 px-5 py-5">

                {recentTransactions.map(
                  (transaction, index) => {

                    const isIncome =
                      transaction.type ===
                      "income";

                    return (
                      <div
                        key={
                          transaction._id ||
                          transaction.id ||
                          index
                        }
                        className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              isIncome
                                ? "bg-green-50"
                                : "bg-red-50"
                            }`}
                          >

                            {isIncome ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-gray-700">
                              {transaction.description ||
                                "Transaction"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {transaction.category ||
                                "Other"}
                            </p>

                          </div>

                        </div>

                        <div className="ml-3 shrink-0 text-right">

                          <p
                            className={`text-sm font-semibold ${
                              isIncome
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {isIncome
                              ? "+"
                              : "-"}
                            ₹
                            {formatMoney(
                              Math.abs(
                                parseAmount(
                                  transaction.amount
                                )
                              )
                            )}
                          </p>

                          <p className="text-[10px] text-gray-400">
                            {formatDate(
                              transaction.date
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

          {/* ==================================================
              SPENDING BY CATEGORY
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 px-5 py-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50">
                <PieChartIcon className="h-5 w-5 text-cyan-600" />
              </div>

              <h2 className="text-lg font-bold text-[#172033]">
                Spending by Category
              </h2>

            </div>

            {categoryData.length === 0 ? (

              <div className="px-5 pb-5">

                <div className="flex h-44 items-center justify-center">

                  <div className="flex items-center">

                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-gray-100">

                      <div className="h-20 w-20 rounded-full border-8 border-gray-50" />

                    </div>

                    <div className="ml-6 flex items-center gap-2">

                      <span className="h-3 w-3 rounded-sm bg-gray-200" />

                      <span className="text-sm text-gray-600">
                        No data available
                      </span>

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-cyan-50 p-4">

                    <p className="text-xs text-gray-500">
                      Total Income
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      ₹
                      {formatMoney(
                        currentIncome
                      )}
                    </p>

                  </div>

                  <div className="rounded-lg bg-orange-50 p-4">

                    <p className="text-xs text-gray-500">
                      Total Expense
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      ₹
                      {formatMoney(
                        currentExpense
                      )}
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <>

                <div className="h-52 px-4">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >

                        {categoryData.map(
                          (entry, index) => (
                            <Cell
                              key={`category-${entry.name}-${index}`}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          `₹${formatMoney(value)}`
                        }
                      />

                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                <div className="grid grid-cols-2 gap-3 px-5 pb-5">

                  <div className="rounded-lg bg-cyan-50 p-4">

                    <p className="text-xs text-gray-500">
                      Total Income
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      ₹
                      {formatMoney(
                        currentIncome
                      )}
                    </p>

                  </div>

                  <div className="rounded-lg bg-orange-50 p-4">

                    <p className="text-xs text-gray-500">
                      Total Expense
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      ₹
                      {formatMoney(
                        currentExpense
                      )}
                    </p>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      </div>

      {/* ==================================================
          ADD TRANSACTION MODAL
      ================================================== */}

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={
          handleAddTransaction
        }
        title="Add New Transaction"
        buttonText="Add Transaction"
      />

    </div>
  );
};

export default Dashboard;