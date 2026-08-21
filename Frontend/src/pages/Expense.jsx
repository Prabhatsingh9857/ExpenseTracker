import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { useOutletContext } from "react-router-dom";

import {
  Plus,
  DollarSign,
  Download,
  Eye,
  Calendar,
  TrendingDown,
  Filter,
  BarChart2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import axios from "axios";

import { exportToExcel } from "../utils/exportUtils";

import FinancialCard from "../components/FinancialCard";
import TimeFrameSelector from "../components/TimeFrame";
import TransactionItem from "../components/TransactionItem";
import AddTransactionModal from "../components/Add";

import {
  getTimeFrameRange,
  generateChartPoints,
} from "../components/Helpers";

import { CATEGORY_ICONS } from "../assets/color";

import { expensePageStyles as styles } from "../assets/dummyStyle";


// ======================================================
// API
// ======================================================

const API_BASE = "http://https://expense-tracker-backend-9t99.onrender.com/api";


// ======================================================
// DATE HELPER
// ======================================================

function toIsoWithClientTime(dateValue) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (
    typeof dateValue === "string" &&
    dateValue.length === 10
  ) {
    const now = new Date();

    const time = now
      .toTimeString()
      .slice(0, 8);

    const combined = new Date(
      `${dateValue}T${time}`
    );

    if (!Number.isNaN(combined.getTime())) {
      return combined.toISOString();
    }
  }

  const parsed = new Date(dateValue);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}


// ======================================================
// EXPENSE PAGE
// ======================================================

const ExpensePage = () => {

  const outletContext = useOutletContext() || {};

  const {
    transactions: outletTransactions = [],
    timeFrame = "monthly",
    setTimeFrame = () => {},
    refreshTransactions = async () => {},
  } = outletContext;


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

  const [selectedMonth, setSelectedMonth] =
    useState(null);

  const [loading, setLoading] =
    useState(false);


  const [overview, setOverview] = useState({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0,
    recentTransactions: [],
    range: "monthly",
  });


  const [editForm, setEditForm] =
    useState({
      description: "",
      amount: "",
      category: "Food",
      date: new Date()
        .toISOString()
        .split("T")[0],
    });


  const [newTransaction, setNewTransaction] =
    useState({
      date: new Date()
        .toISOString()
        .split("T")[0],

      description: "",

      amount: "",

      type: "expense",

      category: "Food",
    });


  // ====================================================
  // AUTH HEADERS
  // ====================================================

  const getAuthHeaders = useCallback(() => {

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };

  }, []);


  // ====================================================
  // TIME FRAME RANGE
  // ====================================================

  const timeFrameRange = useMemo(() => {

    return getTimeFrameRange(
      timeFrame,
      selectedMonth
    );

  }, [timeFrame, selectedMonth]);


  // ====================================================
  // CHART POINTS
  // ====================================================

  const chartPoints = useMemo(() => {

    return generateChartPoints(
      timeFrame,
      timeFrameRange
    );

  }, [timeFrame, timeFrameRange]);


  // ====================================================
  // DATE RANGE CHECK
  // ====================================================

  const isDateInRange = useCallback(
    (date, start, end) => {

      if (!date || !start || !end) {
        return false;
      }

      const transactionDate =
        new Date(date);

      const startDate =
        new Date(start);

      const endDate =
        new Date(end);

      if (
        Number.isNaN(
          transactionDate.getTime()
        )
      ) {
        return false;
      }

      transactionDate.setHours(
        0,
        0,
        0,
        0
      );

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      return (
        transactionDate >= startDate &&
        transactionDate <= endDate
      );

    },
    []
  );


  // ====================================================
  // EXPENSE TRANSACTIONS
  // ====================================================

  const expenseTransactions =
    useMemo(() => {

      return (outletTransactions || [])
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

    }, [outletTransactions]);


  // ====================================================
  // TIME FRAME TRANSACTIONS
  // ====================================================

  const timeFrameTransactions =
    useMemo(() => {

      return expenseTransactions.filter(
        (transaction) =>
          isDateInRange(
            transaction.date,
            timeFrameRange.start,
            timeFrameRange.end
          )
      );

    }, [
      expenseTransactions,
      timeFrameRange,
      isDateInRange,
    ]);


  // ====================================================
  // FILTERED TRANSACTIONS
  // ====================================================

  const filteredTransactions =
    useMemo(() => {

      if (filter === "all") {
        return timeFrameTransactions;
      }

      const now = new Date();

      const selectedDate =
        selectedMonth
          ? new Date(selectedMonth)
          : timeFrameRange.start;

      const selectedYear =
        selectedDate.getFullYear();

      const selectedMonthNumber =
        selectedDate.getMonth();


      return timeFrameTransactions.filter(
        (transaction) => {

          const transactionDate =
            new Date(transaction.date);

          if (
            Number.isNaN(
              transactionDate.getTime()
            )
          ) {
            return false;
          }


          if (filter === "month") {

            return (
              transactionDate.getFullYear() ===
                selectedYear &&
              transactionDate.getMonth() ===
                selectedMonthNumber
            );

          }


          if (filter === "year") {

            return (
              transactionDate.getFullYear() ===
              selectedYear
            );

          }


          return (
            String(
              transaction.category || "Other"
            ).toLowerCase() ===
            filter.toLowerCase()
          );

        }
      );

    }, [
      timeFrameTransactions,
      filter,
      selectedMonth,
      timeFrameRange,
    ]);


  // ====================================================
  // TOTAL EXPENSE
  // ====================================================

  const totalExpense = useMemo(() => {

    return filteredTransactions.reduce(
      (sum, transaction) =>
        sum +
        Math.round(
          Number(transaction.amount || 0)
        ),
      0
    );

  }, [filteredTransactions]);


  // ====================================================
  // AVERAGE EXPENSE
  // ====================================================

  const averageExpense = useMemo(() => {

    if (
      filteredTransactions.length === 0
    ) {
      return 0;
    }

    return Math.round(
      totalExpense /
        filteredTransactions.length
    );

  }, [
    totalExpense,
    filteredTransactions,
  ]);


  // ====================================================
  // CHART DATA
  // ====================================================

  const chartData = useMemo(() => {

    const data =
      chartPoints.map((point) => ({
        ...point,
        expense: 0,
      }));


    filteredTransactions.forEach(
      (transaction) => {

        const transactionDate =
          new Date(transaction.date);

        if (
          Number.isNaN(
            transactionDate.getTime()
          )
        ) {
          return;
        }


        const point = data.find(
          (item) => {

            if (
              timeFrame === "daily"
            ) {
              return (
                item.hour ===
                transactionDate.getHours()
              );
            }


            if (
              timeFrame === "yearly"
            ) {
              return (
                item.date &&
                item.date.getMonth() ===
                  transactionDate.getMonth()
              );
            }


            return (
              item.date &&
              item.date.getDate() ===
                transactionDate.getDate() &&
              item.date.getMonth() ===
                transactionDate.getMonth()
            );

          }
        );


        if (point) {

          point.expense += Math.round(
            Number(
              transaction.amount || 0
            )
          );

        }

      }
    );


    return data;

  }, [
    filteredTransactions,
    chartPoints,
    timeFrame,
  ]);


  // ====================================================
  // FETCH OVERVIEW
  // ====================================================

  const fetchOverview = useCallback(
    async (
      range = timeFrame || "monthly"
    ) => {

      try {

        const response =
          await axios.get(
            `${API_BASE}/expense/overview`,
            {
              headers:
                getAuthHeaders(),

              params: {
                range,
              },
            }
          );


        const payload =
          response.data?.data || {};


        setOverview({
          totalExpense:
            payload.totalExpense || 0,

          averageExpense:
            payload.averageExpense || 0,

          numberOfTransactions:
            payload.numberOfTransactions ||
            0,

          recentTransactions:
            payload.recentTransactions ||
            [],

          range:
            payload.range || range,
        });

      } catch (error) {

        console.error(
          "Failed to fetch expense overview:",
          error
        );

      }

    },
    [
      timeFrame,
      getAuthHeaders,
    ]
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
  // API REQUEST
  // ====================================================

  const handleApiRequest = async (
    method,
    url,
    data = null
  ) => {

    try {

      setLoading(true);


      const config = {
        method,
        url: `${API_BASE}${url}`,

        headers: {
          "Content-Type":
            "application/json",

          ...getAuthHeaders(),
        },
      };


      if (data) {
        config.data = data;
      }


      const response =
        await axios(config);


      await refreshTransactions();

      await fetchOverview(
        timeFrame || "monthly"
      );


      return response;

    } catch (error) {

      console.error(
        `${method} request error:`,
        error
      );


      const serverMessage =
        error?.response?.data?.message;


      alert(
        serverMessage ||
          "Something went wrong. Please try again."
      );


      throw error;

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // ADD EXPENSE
  // ====================================================

  const handleAddTransaction =
    async () => {

      if (
        !newTransaction.description.trim()
      ) {

        alert(
          "Please enter a description."
        );

        return;

      }


      const amount =
        Number(newTransaction.amount);


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


        await handleApiRequest(
          "post",
          "/expense/add",
          payload
        );


        setNewTransaction({
          date: new Date()
            .toISOString()
            .split("T")[0],

          description: "",

          amount: "",

          type: "expense",

          category: "Food",
        });


        setShowModal(false);


        setShowAll(false);

      } catch (error) {

        // Already handled above.

      }

    };


  // ====================================================
  // EDIT EXPENSE
  // ====================================================

  const handleEditTransaction =
    async () => {

      if (!editingId) {
        return;
      }


      if (
        !editForm.description.trim()
      ) {

        alert(
          "Please enter a description."
        );

        return;

      }


      const amount =
        Number(editForm.amount);


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

        const payload = {

          description:
            editForm.description.trim(),

          amount,

          category:
            editForm.category,

          date:
            toIsoWithClientTime(
              editForm.date
            ),

        };


        await handleApiRequest(
          "put",
          `/expense/update/${editingId}`,
          payload
        );


        setEditingId(null);

      } catch (error) {

        // Already handled.

      }

    };


  // ====================================================
  // DELETE EXPENSE
  // ====================================================

  const handleDeleteTransaction =
    async (id) => {

      if (!id) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this expense?"
        );


      if (!confirmed) {
        return;
      }


      try {

        await handleApiRequest(
          "delete",
          `/expense/delete/${id}`
        );

      } catch (error) {

        // Already handled.

      }

    };


  // ====================================================
  // EXPORT
  // ====================================================

  const handleExport = async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE}/expense/downloadexcel`,
          {
            headers:
              getAuthHeaders(),

            responseType:
              "blob",
          }
        );


      const blob = new Blob(
        [response.data],
        {
          type:
            response.headers[
              "content-type"
            ] ||
            "application/octet-stream",
        }
      );


      const disposition =
        response.headers[
          "content-disposition"
        ];


      let filename =
        "expense_details.xlsx";


      if (disposition) {

        const match =
          disposition.match(
            /filename="?([^"]+)"?/
          );


        if (match?.[1]) {
          filename = match[1];
        }

      }


      const url =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement("a");


      link.href = url;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();


      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(
        "Server export failed:",
        error
      );


      try {

        const exportData =
          filteredTransactions.map(
            (transaction) => ({
              Date:
                new Date(
                  transaction.date
                ).toLocaleDateString(),

              Description:
                transaction.description ||
                "",

              Category:
                transaction.category ||
                "Other",

              Amount:
                transaction.amount || 0,

              Type:
                "Expense",
            })
          );


        if (
          exportData.length === 0
        ) {

          alert(
            "No expense transactions to export."
          );

          return;

        }


        exportToExcel(
          exportData,
          `expenses_${new Date()
            .toISOString()
            .slice(0, 10)}`
        );

      } catch (exportError) {

        console.error(
          "Fallback export failed:",
          exportError
        );


        alert(
          "Failed to export expense data."
        );

      }

    }

  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className={
        styles?.container ||
        "min-h-screen bg-gray-50 p-4 md:p-6"
      }
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className={
          styles?.headerCard ||
          "rounded-2xl bg-white border border-gray-200 p-5 shadow-sm"
        }
      >

        <div
          className={
            styles?.headerContainer ||
            "flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          }
        >

          <div>

            <h1
              className={
                styles?.headerTitle ||
                "text-2xl font-bold text-gray-900"
              }
            >
              Expense Overview
            </h1>

            <p
              className={
                styles?.headerSubtitle ||
                "mt-1 text-sm text-gray-500"
              }
            >
              Track and manage your expenses
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowModal(true)
            }
            disabled={loading}
            className={
              styles?.addButton ||
              "inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            }
          >

            <Plus size={20} />

            {loading
              ? "Processing..."
              : "Add Expense"}

          </button>

        </div>


        {/* TIME FRAME */}

        <div
          className={
            styles?.timeframePositioning ||
            "mt-5"
          }
        >

          <TimeFrameSelector
            timeFrame={timeFrame}
            setTimeFrame={(frame) => {

              setTimeFrame(frame);

              setSelectedMonth(null);

              setShowAll(false);

            }}
            options={[
              "daily",
              "weekly",
              "monthly",
              "yearly",
            ]}
            color="orange"
          />

        </div>

      </div>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div
        className={
          styles?.cardsGrid ||
          "mt-5 grid grid-cols-1 gap-4 md:grid-cols-3"
        }
      >

        <FinancialCard
          icon={
            <div
              className={
                styles?.iconOrange ||
                "flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50"
              }
            >
              <DollarSign
                className={
                  styles?.textOrange ||
                  "h-5 w-5 text-orange-600"
                }
              />
            </div>
          }

          label="Total Expenses"

          value={`₹${totalExpense.toLocaleString(
            "en-IN"
          )}`}

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
                styles?.iconAmber ||
                "flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"
              }
            >
              <BarChart2
                className={
                  styles?.textAmber ||
                  "h-5 w-5 text-amber-600"
                }
              />
            </div>
          }

          label="Average Expense"

          value={`₹${averageExpense.toLocaleString(
            "en-IN"
          )}`}

          additionalContent={
            <div className="mt-2 flex items-center text-xs text-gray-500">

              <Calendar className="mr-1 h-3 w-3" />

              {filteredTransactions.length}{" "}
              transactions

            </div>
          }
        />


        <FinancialCard
          icon={
            <div
              className={
                styles?.iconYellow ||
                "flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50"
              }
            >
              <TrendingDown
                className={
                  styles?.textYellow ||
                  "h-5 w-5 text-yellow-600"
                }
              />
            </div>
          }

          label="Transactions"

          value={
            filteredTransactions.length
          }

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

      <div
        className={
          styles?.chartContainer ||
          "mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        }
      >

        <div
          className={
            styles?.chartHeader ||
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          }
        >

          <h3
            className={
              styles?.chartTitle ||
              "flex items-center gap-2 text-lg font-bold text-gray-900"
            }
          >

            <BarChart2 className="h-6 w-6 text-orange-500" />

            {timeFrame === "daily"
              ? "Hourly"
              : timeFrame === "yearly"
              ? "Monthly"
              : "Daily"}{" "}

            Expense Trends

            <span className="text-sm font-normal text-gray-500">
              ({timeFrameRange.label})
            </span>

          </h3>


          <button
            type="button"
            onClick={handleExport}
            className={
              styles?.chartExportButton ||
              "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            }
          >

            <Download size={18} />

            Export Data

          </button>

        </div>


        <div
          className={
            styles?.chartHeight ||
            "mt-4 h-72"
          }
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >

              <defs>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#f97316"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#f97316"
                    stopOpacity={0.1}
                  />

                </linearGradient>

              </defs>


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
                    value
                  ).toLocaleString(
                    "en-IN"
                  )}`
                }
              />


              <Tooltip
                formatter={(value) => [
                  `₹${Math.round(
                    Number(value)
                  ).toLocaleString(
                    "en-IN"
                  )}`,
                  "Expense",
                ]}
              />


              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f97316"
                fill="url(#expenseGradient)"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                }}
              />


              {chartData.map(
                (point, index) =>
                  point.isCurrent && (
                    <ReferenceLine
                      key={index}
                      x={point.label}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  )
              )}

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ==================================================
          TRANSACTIONS
      ================================================== */}

      <div
        className={
          styles?.transactionsContainer ||
          "mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm"
        }
      >

        <div
          className={
            styles?.transactionsHeader ||
            "flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between"
          }
        >

          <h3
            className={
              styles?.transactionsTitle ||
              "flex items-center gap-2 text-lg font-bold text-gray-900"
            }
          >

            <DollarSign className="h-6 w-6 text-orange-500" />

            Expense Transactions

            <span className="text-sm font-normal text-gray-500">
              ({timeFrameRange.label})
            </span>

          </h3>


          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

            <div className="relative w-full sm:w-auto">

              <select
                value={filter}
                onChange={(event) => {

                  setFilter(
                    event.target.value
                  );

                  setShowAll(false);

                }}
                className={
                  styles?.filterSelect ||
                  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none focus:border-orange-500 sm:w-auto"
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

                <option value="Food">
                  Food
                </option>

                <option value="Housing">
                  Housing
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Utilities">
                  Utilities
                </option>

                <option value="Healthcare">
                  Healthcare
                </option>

                <option value="Other">
                  Other
                </option>

              </select>


              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            </div>


            <button
              type="button"
              onClick={handleExport}
              className={
                styles?.exportButton ||
                "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              }
            >

              <Download size={18} />

              Export

            </button>

          </div>

        </div>


        <div
          className={
            styles?.transactionsList ||
            "p-5"
          }
        >

          {filteredTransactions
            .slice(
              0,
              showAll
                ? filteredTransactions.length
                : 8
            )
            .map((transaction) => {

              const transactionId =
                transaction._id ||
                transaction.id;


              return (
                <TransactionItem
                  key={transactionId}
                  transaction={transaction}
                  isEditing={
                    editingId ===
                    transactionId
                  }
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onSave={
                    handleEditTransaction
                  }
                  onCancel={() =>
                    setEditingId(null)
                  }
                  onDelete={
                    handleDeleteTransaction
                  }
                  type="expense"
                  categoryIcons={
                    CATEGORY_ICONS
                  }
                  setEditingId={
                    setEditingId
                  }
                />
              );

            })}


          {!showAll &&
            filteredTransactions.length >
              8 && (

              <button
                type="button"
                onClick={() =>
                  setShowAll(true)
                }
                className={
                  styles?.viewAllButton ||
                  "mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-100"
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


          {filteredTransactions.length ===
            0 && (

            <div
              className={
                styles?.emptyState ||
                "flex flex-col items-center justify-center py-12 text-center"
              }
            >

              <div
                className={
                  styles?.emptyStateIcon ||
                  "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50"
                }
              >

                <DollarSign className="h-8 w-8 text-orange-400" />

              </div>


              <p
                className={
                  styles?.emptyStateText ||
                  "font-semibold text-gray-700"
                }
              >
                No expense transactions found
              </p>


              <p
                className={
                  styles?.emptyStateSubtext ||
                  "mt-1 text-sm text-gray-500"
                }
              >

                {filter === "all"
                  ? "You haven't recorded any expenses yet"
                  : `No ${filter} transactions found`}

              </p>


              <button
                type="button"
                onClick={() =>
                  setShowModal(true)
                }
                className={
                  styles?.addButton ||
                  "mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                }
              >

                <Plus size={20} />

                Add Expense

              </button>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          ADD EXPENSE MODAL
      ================================================== */}

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
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
        type="expense"
        title="Add New Expense"
        buttonText="Add Expense"
        categories={[
          "Food",
          "Housing",
          "Transport",
          "Shopping",
          "Entertainment",
          "Utilities",
          "Healthcare",
          "Other",
        ]}
        color="orange"
      />

    </div>
  );
};


export default ExpensePage;