import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useOutletContext } from "react-router-dom";

import {
  Plus,
  DollarSign,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Filter,
  BarChart2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

import axios from "axios";

import AddTransactionModal from "../components/Add";
import TransactionItem from "../components/TransactionItem";
import TimeFrameSelector from "../components/TimeFrame";
import FinancialCard from "../components/FinancialCard";

import { exportToExcel } from "../utils/exportUtils";

// ======================================================
// API
// ======================================================

const API_BASE = "http://localhost:4000/api";

// ======================================================
// COLORS
// ======================================================

const INCOME_COLORS = [
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

// ======================================================
// CATEGORY ICONS
// ======================================================

const CATEGORY_ICONS = {
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Bonus: "🎁",
  Other: "💰",
};

// ======================================================
// STYLES
// ======================================================

const styles = {
  wrapper:
    "min-h-[calc(100vh-64px)] w-full bg-[#f5f7f9] px-4 py-5 sm:px-6 lg:px-7",

  headerContainer:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  header:
    "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",

  headerTitle:
    "text-2xl font-bold tracking-tight text-[#172033]",

  headerSubtitle:
    "mt-1 text-sm text-gray-500",

  addButton:
    "flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50",

  timeFrameContainer:
    "mt-5 flex justify-end",

  summaryGrid:
    "mb-5 grid grid-cols-1 gap-4 md:grid-cols-3",

  iconGreen:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-green-50",

  textGreen:
    "text-green-600",

  iconBlue:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50",

  textBlue:
    "text-blue-600",

  iconPurple:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50",

  textPurple:
    "text-purple-600",

  chartContainer:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  chartHeaderContainer:
    "mb-4",

  chartTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  chartHeight:
    "h-72 w-full",

  tooltipContent: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },

  filterContainer:
    "flex flex-col gap-2 sm:flex-row sm:items-center",

  filterSelect:
    "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-9 text-sm text-gray-600 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-auto",

  filterIcon:
    "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",

  exportButton:
    "flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-teal-600",

  listContainer:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",

  sectionHeader:
    "flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between",

  sectionTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  transactionList:
    "divide-y divide-gray-100",

  viewAllButton:
    "flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-teal-600 transition hover:bg-teal-50",

  emptyStateContainer:
    "flex min-h-72 flex-col items-center justify-center px-5 py-10 text-center",

  emptyStateIcon:
    "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50",

  emptyStateText:
    "text-sm font-semibold text-gray-700",

  emptyStateSubtext:
    "mt-1 text-xs text-gray-400",

  emptyStateButton:
    "mt-4 flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700",
};

// ======================================================
// DATE HELPERS
// ======================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ======================================================
// TIME FRAME RANGE
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

    start.setDate(
      start.getDate() - day
    );

    start.setHours(0, 0, 0, 0);

    end = new Date(start);

    end.setDate(
      end.getDate() + 6
    );

    end.setHours(23, 59, 59, 999);

    label = "This Week";
  }

  // YEARLY
  else if (timeFrame === "yearly") {
    start = new Date(
      now.getFullYear(),
      0,
      1,
      0,
      0,
      0,
      0
    );

    end = new Date(
      now.getFullYear(),
      11,
      31,
      23,
      59,
      59,
      999
    );

    label = "This Year";
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
// DATE CHECK
// ======================================================

const isDateInRange = (
  date,
  start,
  end
) => {
  if (!date) return false;

  const transactionDate =
    new Date(date);

  if (
    Number.isNaN(
      transactionDate.getTime()
    )
  ) {
    return false;
  }

  return (
    transactionDate >= start &&
    transactionDate <= end
  );
};

// ======================================================
// DATE FORMAT
// ======================================================

const formatDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ======================================================
// ISO DATE
// ======================================================

const toIsoWithClientTime = (
  dateValue
) => {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (
    typeof dateValue === "string" &&
    dateValue.length === 10
  ) {
    const now = new Date();

    const time =
      now
        .toTimeString()
        .slice(0, 8);

    const combined =
      new Date(
        `${dateValue}T${time}`
      );

    return combined.toISOString();
  }

  const parsed =
    new Date(dateValue);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
};

// ======================================================
// CHART POINTS
// ======================================================

const generateChartPoints = (
  timeFrame,
  range
) => {
  const points = [];

  if (timeFrame === "daily") {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(range.start);

      date.setHours(hour, 0, 0, 0);

      points.push({
        label: `${String(hour).padStart(2, "0")}:00`,
        date,
        hour,
      });
    }

    return points;
  }

  if (timeFrame === "yearly") {
    for (let month = 0; month < 12; month++) {
      const date = new Date(
        range.start.getFullYear(),
        month,
        1
      );

      points.push({
        label: date.toLocaleString(
          "en-US",
          {
            month: "short",
          }
        ),
        date,
      });
    }

    return points;
  }

  const current = new Date(
    range.start
  );

  while (
    current <= range.end
  ) {
    const date = new Date(current);

    points.push({
      label: date.toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
        }
      ),
      date,
    });

    current.setDate(
      current.getDate() + 1
    );
  }

  return points;
};

// ======================================================
// INCOME CHART
// ======================================================

const IncomeChart = ({
  chartData,
  timeFrame,
  timeFrameRange,
}) => {
  return (
    <div className={styles.chartContainer}>

      <div
        className={
          styles.chartHeaderContainer
        }
      >
        <h3
          className={
            styles.chartTitle
          }
        >
          <BarChart2 className="h-5 w-5 text-green-500" />

          {timeFrame === "daily"
            ? "Hourly"
            : timeFrame === "yearly"
            ? "Monthly"
            : "Daily"}{" "}
          Income Trends

          <span className="text-sm font-normal text-gray-500">
            {" "}
            ({timeFrameRange.label})
          </span>
        </h3>
      </div>

      <div
        className={
          styles.chartHeight
        }
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              width={60}
              tickFormatter={(value) =>
                `₹${Number(
                  value || 0
                ).toLocaleString("en-IN")}`
              }
            />

            <Tooltip
              formatter={(value) => [
                `₹${Math.round(
                  Number(value || 0)
                ).toLocaleString(
                  "en-IN"
                )}`,
                "Income",
              ]}
              contentStyle={
                styles.tooltipContent
              }
            />

            <Bar
              dataKey="income"
              name="Income"
              radius={[
                6,
                6,
                0,
                0,
              ]}
              barSize={20}
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      INCOME_COLORS[
                        index %
                          INCOME_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ======================================================
// FILTER
// ======================================================

const FilterSection = ({
  filter,
  setFilter,
  handleExport,
}) => {
  return (
    <div
      className={
        styles.filterContainer
      }
    >
      <div className="relative w-full sm:w-auto">

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className={
            styles.filterSelect
          }
        >
          <option value="all">
            All Transactions
          </option>

          <option value="month">
            This Month
          </option>

          <option value="year">
            This Year
          </option>

          <option value="Salary">
            Salary
          </option>

          <option value="Freelance">
            Freelance
          </option>

          <option value="Investment">
            Investment
          </option>

          <option value="Bonus">
            Bonus
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <Filter
          className={
            styles.filterIcon
          }
        />
      </div>

      <button
        type="button"
        onClick={handleExport}
        className={
          styles.exportButton
        }
      >
        <Download size={16} />
        Export
      </button>
    </div>
  );
};

// ======================================================
// INCOME PAGE
// ======================================================

const Income = () => {
  const outletContext =
    useOutletContext() || {};

  const {
    transactions: outletTransactions = [],
    allTransactions = [],
    timeFrame = "monthly",
    setTimeFrame = () => {},
    refreshTransactions =
      async () => {},
  } = outletContext;

  // ====================================================
  // USE WHICHEVER TRANSACTION ARRAY EXISTS
  // ====================================================

  const transactions =
    outletTransactions.length > 0
      ? outletTransactions
      : allTransactions;

  // ====================================================
  // STATE
  // ====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [showAll, setShowAll] =
    useState(false);

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(false);

  const [overview, setOverview] =
    useState({
      totalIncome: null,
      averageIncome: null,
      numberOfTransactions: null,
      recentTransactions: [],
      range: "monthly",
    });

  const [newTransaction, setNewTransaction] =
    useState({
      date: getToday(),
      description: "",
      amount: "",
      type: "income",
      category: "Salary",
    });

  const [editForm, setEditForm] =
    useState({
      description: "",
      amount: "",
      category: "Salary",
      date: getToday(),
    });

  // ====================================================
  // AUTH HEADERS
  // ====================================================

  const getAuthHeaders =
    useCallback(() => {
      const token =
        localStorage.getItem(
          "token"
        ) ||
        sessionStorage.getItem(
          "token"
        );

      return token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};
    }, []);

  // ====================================================
  // TIME FRAME
  // ====================================================

  const timeFrameRange =
    useMemo(
      () =>
        getTimeFrameRange(
          timeFrame
        ),
      [timeFrame]
    );

  // ====================================================
  // INCOME TRANSACTIONS
  // ====================================================

  const incomeTransactions =
    useMemo(() => {
      return [...transactions]
        .filter(
          (transaction) =>
            transaction.type ===
            "income"
        )
        .sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );
    }, [transactions]);

  // ====================================================
  // CURRENT TIME FRAME
  // ====================================================

  const timeFrameTransactions =
    useMemo(() => {
      return incomeTransactions.filter(
        (transaction) =>
          isDateInRange(
            transaction.date,
            timeFrameRange.start,
            timeFrameRange.end
          )
      );
    }, [
      incomeTransactions,
      timeFrameRange,
    ]);

  // ====================================================
  // FILTERED TRANSACTIONS
  // ====================================================

  const filteredTransactions =
    useMemo(() => {
      if (filter === "all") {
        return timeFrameTransactions;
      }

      if (filter === "month") {
        return timeFrameTransactions.filter(
          (transaction) => {
            const date =
              new Date(
                transaction.date
              );

            return (
              date.getMonth() ===
                new Date().getMonth() &&
              date.getFullYear() ===
                new Date().getFullYear()
            );
          }
        );
      }

      if (filter === "year") {
        return timeFrameTransactions.filter(
          (transaction) => {
            const date =
              new Date(
                transaction.date
              );

            return (
              date.getFullYear() ===
              new Date().getFullYear()
            );
          }
        );
      }

      return timeFrameTransactions.filter(
        (transaction) =>
          String(
            transaction.category ||
              ""
          ).toLowerCase() ===
          filter.toLowerCase()
      );
    }, [
      timeFrameTransactions,
      filter,
    ]);

  // ====================================================
  // CHART DATA
  // ====================================================

  const chartData =
    useMemo(() => {
      const points =
        generateChartPoints(
          timeFrame,
          timeFrameRange
        );

      const data = points.map(
        (point) => ({
          ...point,
          income: 0,
        })
      );

      filteredTransactions.forEach(
        (transaction) => {
          const date =
            new Date(
              transaction.date
            );

          const amount = Number(
            transaction.amount || 0
          );

          if (
            !Number.isFinite(
              amount
            )
          ) {
            return;
          }

          const point =
            data.find((item) => {
              if (
                timeFrame ===
                "daily"
              ) {
                return (
                  item.hour ===
                  date.getHours()
                );
              }

              if (
                timeFrame ===
                "yearly"
              ) {
                return (
                  item.date.getMonth() ===
                    date.getMonth() &&
                  item.date.getFullYear() ===
                    date.getFullYear()
                );
              }

              return (
                item.date.getDate() ===
                  date.getDate() &&
                item.date.getMonth() ===
                  date.getMonth() &&
                item.date.getFullYear() ===
                  date.getFullYear()
              );
            });

          if (point) {
            point.income += amount;
          }
        }
      );

      return data;
    }, [
      filteredTransactions,
      timeFrame,
      timeFrameRange,
    ]);

  // ====================================================
  // FETCH OVERVIEW
  // ====================================================

  const fetchOverview =
    useCallback(
      async (
        range = "monthly"
      ) => {
        try {
          const response =
            await axios.get(
              `${API_BASE}/income/overview`,
              {
                headers:
                  getAuthHeaders(),
                params: {
                  range,
                },
              }
            );

          if (
            response.data?.success
          ) {
            const data =
              response.data.data ||
              {};

            setOverview({
              totalIncome:
                data.totalIncome ??
                null,

              averageIncome:
                data.averageIncome ??
                null,

              numberOfTransactions:
                data.numberOfTransactions ??
                null,

              recentTransactions:
                data.recentTransactions ||
                [],

              range:
                data.range ||
                range,
            });
          }
        } catch (error) {
          console.error(
            "Overview error:",
            error
          );
        }
      },
      [getAuthHeaders]
    );

  // ====================================================
  // LOAD OVERVIEW
  // ====================================================

  useEffect(() => {
    fetchOverview(
      timeFrame || "monthly"
    );
  }, [
    fetchOverview,
    timeFrame,
  ]);

  // ====================================================
  // TOTAL INCOME
  // ====================================================

  const calculatedIncome =
    useMemo(() => {
      return filteredTransactions.reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.amount || 0
          ),
        0
      );
    }, [
      filteredTransactions,
    ]);

  const totalIncome =
    filteredTransactions.length > 0
      ? calculatedIncome
      : Number(
          overview.totalIncome || 0
        );

  // ====================================================
  // AVERAGE
  // ====================================================

  const averageIncome =
    filteredTransactions.length > 0
      ? calculatedIncome /
        filteredTransactions.length
      : Number(
          overview.averageIncome || 0
        );

  // ====================================================
  // COUNT
  // ====================================================

  const transactionsCount =
    filteredTransactions.length > 0
      ? filteredTransactions.length
      : Number(
          overview.numberOfTransactions ||
            0
        );

  // ====================================================
  // ADD INCOME
  // ====================================================

  const handleAddTransaction =
    useCallback(async () => {
      if (
        !newTransaction.description.trim()
      ) {
        alert(
          "Please enter a description."
        );
        return;
      }

      const amount = Number(
        newTransaction.amount
      );

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        alert(
          "Please enter a valid amount."
        );
        return;
      }

      try {
        setLoading(true);

        const payload = {
          description:
            newTransaction.description.trim(),

          amount,

          category:
            newTransaction.category,

          date:
            toIsoWithClientTime(
              newTransaction.date
            ),
        };

        await axios.post(
          `${API_BASE}/income/add`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
              ...getAuthHeaders(),
            },
          }
        );

        await refreshTransactions();

        await fetchOverview(
          timeFrame
        );

        setNewTransaction({
          date: getToday(),
          description: "",
          amount: "",
          type: "income",
          category: "Salary",
        });

        setShowModal(false);
      } catch (error) {
        console.error(
          "Add income error:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to add income."
        );
      } finally {
        setLoading(false);
      }
    }, [
      newTransaction,
      getAuthHeaders,
      refreshTransactions,
      fetchOverview,
      timeFrame,
    ]);

  // ====================================================
  // EDIT INCOME
  // ====================================================

  const handleEditTransaction =
    useCallback(async () => {
      if (
        !editingId ||
        !editForm.description.trim() ||
        !editForm.amount
      ) {
        return;
      }

      try {
        setLoading(true);

        const payload = {
          description:
            editForm.description.trim(),

          amount:
            Number(
              editForm.amount
            ),

          category:
            editForm.category,

          date:
            toIsoWithClientTime(
              editForm.date
            ),
        };

        await axios.put(
          `${API_BASE}/income/update/${editingId}`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
              ...getAuthHeaders(),
            },
          }
        );

        await refreshTransactions();

        await fetchOverview(
          timeFrame
        );

        setEditingId(null);
      } catch (error) {
        console.error(
          "Edit income error:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to update income."
        );
      } finally {
        setLoading(false);
      }
    }, [
      editingId,
      editForm,
      getAuthHeaders,
      refreshTransactions,
      fetchOverview,
      timeFrame,
    ]);

  // ====================================================
  // DELETE INCOME
  // ====================================================

  const handleDeleteTransaction =
    useCallback(
      async (id) => {
        if (!id) return;

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this income?"
          );

        if (!confirmed) return;

        try {
          setLoading(true);

          await axios.delete(
            `${API_BASE}/income/delete/${id}`,
            {
              headers:
                getAuthHeaders(),
            }
          );

          await refreshTransactions();

          await fetchOverview(
            timeFrame
          );
        } catch (error) {
          console.error(
            "Delete income error:",
            error
          );

          alert(
            error?.response?.data
              ?.message ||
              "Failed to delete income."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        getAuthHeaders,
        refreshTransactions,
        fetchOverview,
        timeFrame,
      ]
    );

  // ====================================================
  // EXPORT
  // ====================================================

  const handleExport =
    useCallback(async () => {
      try {
        const response =
          await axios.get(
            `${API_BASE}/income/downloadexcel`,
            {
              headers:
                getAuthHeaders(),
              responseType:
                "blob",
            }
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                response.headers[
                  "content-type"
                ] ||
                "application/octet-stream",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "income_details.xlsx";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(
          "Export error:",
          error
        );

        try {
          const exportData =
            filteredTransactions.map(
              (transaction) => ({
                Date: formatDate(
                  transaction.date
                ),

                Description:
                  transaction.description,

                Category:
                  transaction.category,

                Amount:
                  transaction.amount,

                Type: "Income",
              })
            );

          exportToExcel(
            exportData,
            `income_${getToday()}`
          );
        } catch (fallbackError) {
          console.error(
            "Fallback export error:",
            fallbackError
          );

          alert(
            "Failed to export income data."
          );
        }
      }
    }, [
      getAuthHeaders,
      filteredTransactions,
    ]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className={styles.wrapper}>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className={
          styles.headerContainer
        }
      >
        <div className={styles.header}>

          <div>
            <h1
              className={
                styles.headerTitle
              }
            >
              Income Overview
            </h1>

            <p
              className={
                styles.headerSubtitle
              }
            >
              Track and manage your
              income sources
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowModal(true)
            }
            className={
              styles.addButton
            }
            disabled={loading}
          >
            <Plus size={18} />

            {loading
              ? "Processing..."
              : "Add Income"}
          </button>

        </div>

        <div
          className={
            styles.timeFrameContainer
          }
        >
          <TimeFrameSelector
            timeFrame={timeFrame}
            setTimeFrame={
              setTimeFrame
            }
            options={[
              "daily",
              "weekly",
              "monthly",
              "yearly",
            ]}
            color="teal"
          />
        </div>
      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div
        className={
          styles.summaryGrid
        }
      >

        <FinancialCard
          icon={
            <div
              className={
                styles.iconGreen
              }
            >
              <DollarSign
                className={`h-5 w-5 ${styles.textGreen}`}
              />
            </div>
          }
          label="Total Income"
          value={`₹${Math.round(
            totalIncome
          ).toLocaleString("en-IN")}`}
          additionalContent={
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              {timeFrameRange.label}
            </div>
          }
        />

        <FinancialCard
          icon={
            <div
              className={
                styles.iconBlue
              }
            >
              <BarChart2
                className={`h-5 w-5 ${styles.textBlue}`}
              />
            </div>
          }
          label="Average Income"
          value={`₹${Math.round(
            averageIncome
          ).toLocaleString("en-IN")}`}
          additionalContent={
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              {transactionsCount}{" "}
              transactions
            </div>
          }
        />

        <FinancialCard
          icon={
            <div
              className={
                styles.iconPurple
              }
            >
              <TrendingUp
                className={`h-5 w-5 ${styles.textPurple}`}
              />
            </div>
          }
          label="Transactions"
          value={transactionsCount}
          additionalContent={
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />

              {filter === "all"
                ? "All records"
                : "Filtered records"}
            </div>
          }
        />

      </div>

      {/* ==================================================
          CHART
      ================================================== */}

      <IncomeChart
        chartData={chartData}
        timeFrame={timeFrame}
        timeFrameRange={
          timeFrameRange
        }
      />

      {/* ==================================================
          TRANSACTIONS
      ================================================== */}

      <div
        className={
          styles.listContainer
        }
      >

        <div
          className={
            styles.sectionHeader
          }
        >

          <h3
            className={
              styles.sectionTitle
            }
          >
            <DollarSign className="h-5 w-5 text-green-500" />

            Income Transactions

            <span className="text-sm font-normal text-gray-500">
              {" "}
              ({timeFrameRange.label})
            </span>
          </h3>

          <FilterSection
            filter={filter}
            setFilter={setFilter}
            handleExport={
              handleExport
            }
          />

        </div>

        <div
          className={
            styles.transactionList
          }
        >

          {filteredTransactions
            .slice(
              0,
              showAll
                ? filteredTransactions.length
                : 8
            )
            .map(
              (
                transaction,
                index
              ) => (
                <TransactionItem
                  key={
                    transaction._id ||
                    transaction.id ||
                    index
                  }
                  transaction={
                    transaction
                  }
                  isEditing={
                    editingId ===
                    (
                      transaction._id ||
                      transaction.id
                    )
                  }
                  editForm={
                    editForm
                  }
                  setEditForm={
                    setEditForm
                  }
                  onSave={
                    handleEditTransaction
                  }
                  onCancel={() =>
                    setEditingId(null)
                  }
                  onDelete={
                    handleDeleteTransaction
                  }
                  type="income"
                  categoryIcons={
                    CATEGORY_ICONS
                  }
                  setEditingId={
                    setEditingId
                  }
                />
              )
            )}

          {/* VIEW ALL */}

          {!showAll &&
            filteredTransactions.length >
              8 && (
              <button
                type="button"
                onClick={() =>
                  setShowAll(true)
                }
                className={
                  styles.viewAllButton
                }
              >
                <Eye size={18} />

                View All{" "}
                {
                  filteredTransactions.length
                }{" "}
                Transactions
              </button>
            )}

          {/* EMPTY */}

          {filteredTransactions.length ===
            0 && (
            <div
              className={
                styles.emptyStateContainer
              }
            >

              <div
                className={
                  styles.emptyStateIcon
                }
              >
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>

              <p
                className={
                  styles.emptyStateText
                }
              >
                No income transactions
                found
              </p>

              <p
                className={
                  styles.emptyStateSubtext
                }
              >
                {filter ===
                "all"
                  ? "You haven't recorded any income yet"
                  : `No ${filter} transactions found`}
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowModal(true)
                }
                className={
                  styles.emptyStateButton
                }
              >
                <Plus size={16} />
                Add Income
              </button>

            </div>
          )}

        </div>
      </div>

      {/* ==================================================
          ADD INCOME MODAL
      ================================================== */}

      <AddTransactionModal
        showModal={showModal}
        setShowModal={
          setShowModal
        }
        newTransaction={
          newTransaction
        }
        setNewTransaction={
          setNewTransaction
        }
        handleAddTransaction={
          handleAddTransaction
        }
        loading={loading}
        type="income"
        title="Add New Income"
        buttonText="Add Income"
        categories={[
          "Salary",
          "Freelance",
          "Investment",
          "Bonus",
          "Other",
        ]}
        color="teal"
      />

    </div>
  );
};

export default Income;