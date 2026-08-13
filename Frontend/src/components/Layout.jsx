import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { Outlet } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

// ======================================================
// BACKEND API
// ======================================================

const API_BASE = "http://localhost:4000/api";

// ======================================================
// FILTER TRANSACTIONS
// ======================================================

const filterTransactions = (transactions, frame) => {
  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily":
      return transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return date >= today;
      });

    case "weekly": {
      const startOfWeek = new Date(today);

      startOfWeek.setDate(
        startOfWeek.getDate() - startOfWeek.getDay()
      );

      return transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return date >= startOfWeek;
      });
    }

    case "monthly":
      return transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });

    default:
      return transactions;
  }
};

// ======================================================
// SAFE API RESPONSE
// ======================================================

const safeArrayFromResponse = (response) => {
  const body = response?.data;

  if (!body) {
    return [];
  }

  if (Array.isArray(body)) {
    return body;
  }

  if (Array.isArray(body.data)) {
    return body.data;
  }

  if (Array.isArray(body.incomes)) {
    return body.incomes;
  }

  if (Array.isArray(body.expenses)) {
    return body.expenses;
  }

  return [];
};

// ======================================================
// AUTH TOKEN
// ======================================================

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
};

// ======================================================
// STORED USER
// ======================================================

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return {
        name: "User",
        email: "user@example.com",
      };
    }

    const parsedUser = JSON.parse(storedUser);

    return {
      ...parsedUser,

      name:
        parsedUser?.name ||
        parsedUser?.username ||
        parsedUser?.fullName ||
        "User",

      email:
        parsedUser?.email ||
        parsedUser?.gmail ||
        "user@example.com",
    };
  } catch (error) {
    console.error("Unable to load user:", error);

    return {
      name: "User",
      email: "user@example.com",
    };
  }
};

// ======================================================
// LAYOUT
// ======================================================

const Layout = ({ user: appUser, onLogout }) => {
  // ====================================================
  // STATE
  // ====================================================

  const [transactions, setTransactions] = useState([]);

  const [timeFrame, setTimeFrame] = useState("monthly");

  const [loading, setLoading] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [showAllTransactions, setShowAllTransactions] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const [user, setUser] = useState(
    appUser || getStoredUser()
  );

  // ====================================================
  // UPDATE USER
  // ====================================================

  useEffect(() => {
    setUser(appUser || getStoredUser());
  }, [appUser]);

  // ====================================================
  // FETCH TRANSACTIONS
  // ====================================================

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        console.warn("No authentication token found.");
        setTransactions([]);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [incomeResponse, expenseResponse] =
        await Promise.all([
          axios.get(`${API_BASE}/income/get`, {
            headers,
          }),

          axios.get(`${API_BASE}/expense/get`, {
            headers,
          }),
        ]);

      // =================================================
      // INCOME
      // =================================================

      const incomes = safeArrayFromResponse(
        incomeResponse
      ).map((income) => ({
        ...income,
        type: "income",
      }));

      // =================================================
      // EXPENSE
      // =================================================

      const expenses = safeArrayFromResponse(
        expenseResponse
      ).map((expense) => ({
        ...expense,
        type: "expense",
      }));

      // =================================================
      // COMBINE
      // =================================================

      const allTransactions = [
        ...incomes,
        ...expenses,
      ]
        .map((transaction) => ({
          id:
            transaction._id ||
            transaction.id ||
            transaction.id_str ||
            Math.random().toString(36).slice(2),

          description:
            transaction.description ||
            transaction.title ||
            transaction.note ||
            "Transaction",

          amount:
            transaction.amount !== undefined &&
            transaction.amount !== null
              ? Number(transaction.amount)
              : Number(transaction.value) || 0,

          date:
            transaction.date ||
            transaction.createdAt ||
            new Date().toISOString(),

          category:
            transaction.category || "Other",

          type: transaction.type,

          raw: transaction,
        }))
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

      setTransactions(allTransactions);
      setLastUpdated(new Date());

      console.log(
        "Transactions loaded:",
        allTransactions
      );
    } catch (error) {
      console.error(
        "FAILED TO FETCH TRANSACTIONS:",
        error
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      if (error?.response?.status === 401) {
        console.warn(
          "Authentication expired. Please login again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // INITIAL FETCH
  // ====================================================

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ====================================================
  // ADD TRANSACTION
  // ====================================================

  const addTransaction = async (transaction) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      if (
        transaction.type !== "income" &&
        transaction.type !== "expense"
      ) {
        throw new Error(
          "Transaction type must be income or expense."
        );
      }

      const endpoint =
        transaction.type === "income"
          ? "income/add"
          : "expense/add";

      const payload = {
        description:
          transaction.description?.trim() || "",

        amount: Number(transaction.amount),

        category:
          transaction.category || "Other",

        date: transaction.date,
      };

      if (!payload.description) {
        throw new Error(
          "Description is required."
        );
      }

      if (
        !Number.isFinite(payload.amount) ||
        payload.amount <= 0
      ) {
        throw new Error(
          "Amount must be greater than 0."
        );
      }

      if (!payload.date) {
        throw new Error("Date is required.");
      }

      await axios.post(
        `${API_BASE}/${endpoint}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchTransactions();

      return true;
    } catch (error) {
      console.error(
        "FAILED TO ADD TRANSACTION:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  };

  // ====================================================
  // EDIT TRANSACTION
  // ====================================================

  const editTransaction = async (
    id,
    transaction
  ) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      const endpoint =
        transaction.type === "income"
          ? "income/update"
          : "expense/update";

      const payload = {
        description:
          transaction.description?.trim() || "",

        amount: Number(transaction.amount),

        category:
          transaction.category || "Other",

        date: transaction.date,
      };

      await axios.put(
        `${API_BASE}/${endpoint}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchTransactions();

      return true;
    } catch (error) {
      console.error(
        "FAILED TO EDIT TRANSACTION:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  };

  // ====================================================
  // DELETE TRANSACTION
  // ====================================================

  const deleteTransaction = async (
    id,
    type
  ) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      const endpoint =
        type === "income"
          ? "income/delete"
          : "expense/delete";

      await axios.delete(
        `${API_BASE}/${endpoint}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTransactions();

      return true;
    } catch (error) {
      console.error(
        "FAILED TO DELETE TRANSACTION:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  };

  // ====================================================
  // FILTERED TRANSACTIONS
  // ====================================================

  const filteredTransactions = useMemo(() => {
    return filterTransactions(
      transactions,
      timeFrame
    );
  }, [transactions, timeFrame]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const stats = useMemo(() => {
    const now = new Date();

    const thirtyDaysAgo = new Date(now);

    thirtyDaysAgo.setDate(
      now.getDate() - 30
    );

    const sixtyDaysAgo = new Date(now);

    sixtyDaysAgo.setDate(
      now.getDate() - 60
    );

    // Last 30 days
    const last30DaysTransactions =
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return date >= thirtyDaysAgo;
      });

    const last30DaysIncome =
      last30DaysTransactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount || 0),
          0
        );

    const last30DaysExpenses =
      last30DaysTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount || 0),
          0
        );

    // All time
    const allTimeIncome =
      transactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount || 0),
          0
        );

    const allTimeExpenses =
      transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount || 0),
          0
        );

    const last30DaysSavings =
      last30DaysIncome -
      last30DaysExpenses;

    const allTimeSavings =
      allTimeIncome -
      allTimeExpenses;

    const savingsRate =
      last30DaysIncome > 0
        ? Math.round(
            (last30DaysSavings /
              last30DaysIncome) *
              100
          )
        : 0;

    // Previous 30 days
    const previous30DaysTransactions =
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date >= sixtyDaysAgo &&
          date < thirtyDaysAgo
        );
      });

    const previous30DaysExpenses =
      previous30DaysTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount || 0),
          0
        );

    const expenseChange =
      previous30DaysExpenses > 0
        ? Math.round(
            ((last30DaysExpenses -
              previous30DaysExpenses) /
              previous30DaysExpenses) *
              100
          )
        : 0;

    return {
      totalTransactions:
        transactions.length,

      last30DaysIncome,

      last30DaysExpenses,

      last30DaysSavings,

      allTimeIncome,

      allTimeExpenses,

      allTimeSavings,

      last30DaysCount:
        last30DaysTransactions.length,

      savingsRate,

      expenseChange,
    };
  }, [transactions]);

  // ====================================================
  // TIME FRAME LABEL
  // ====================================================

  const timeFrameLabel = useMemo(() => {
    if (timeFrame === "daily") {
      return "Today";
    }

    if (timeFrame === "weekly") {
      return "This Week";
    }

    if (timeFrame === "yearly") {
      return "This Year";
    }

    return "This Month";
  }, [timeFrame]);

  // ====================================================
  // SAVINGS RATING
  // ====================================================

  const getSavingsRating = (rate) => {
    if (rate > 30) {
      return "Excellent";
    }

    if (rate > 20) {
      return "Good";
    }

    return "Needs improvement";
  };

  // ====================================================
  // TOP CATEGORIES
  // ====================================================

  const topCategories = useMemo(() => {
    const categoryTotals =
      transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (accumulator, transaction) => {
            const category =
              transaction.category || "Other";

            accumulator[category] =
              (accumulator[category] || 0) +
              Number(transaction.amount || 0);

            return accumulator;
          },
          {}
        );

    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [transactions]);

  // ====================================================
  // DISPLAYED TRANSACTIONS
  // ====================================================

  const displayedTransactions =
    showAllTransactions
      ? transactions
      : transactions.slice(0, 5);

  // ====================================================
  // OUTLET CONTEXT
  // ====================================================

  const outletContext = {
    transactions: filteredTransactions,

    allTransactions: transactions,

    stats,

    addTransaction,

    editTransaction,

    deleteTransaction,

    refreshTransactions: fetchTransactions,

    timeFrame,

    setTimeFrame,

    timeFrameLabel,

    lastUpdated,

    loading,

    topCategories,

    getSavingsRating,

    displayedTransactions,

    showAllTransactions,

    setShowAllTransactions,
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar
        user={user}
        onLogout={onLogout}
      />

      <Sidebar
        user={user}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
      />

      <main
        className={`
          min-h-screen
          pt-16
          transition-all
          duration-300
          ${
            sidebarCollapsed
              ? "lg:ml-20"
              : "lg:ml-60"
          }
        `}
      >
        <Outlet context={outletContext} />
      </main>

    </div>
  );
};

export default Layout;