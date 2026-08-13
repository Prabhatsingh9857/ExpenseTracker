import React from "react";
import {
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  title = "Add New Transaction",
  buttonText = "Add Transaction",
}) => {
  // ======================================================
  // HIDE MODAL
  // ======================================================

  if (!showModal) {
    return null;
  }

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewTransaction((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // HANDLE TRANSACTION TYPE
  // ======================================================

  const handleTypeChange = (type) => {
    setNewTransaction((previous) => ({
      ...previous,
      type,
      category:
        type === "expense"
          ? "Food"
          : "Salary",
    }));
  };

  // ======================================================
  // HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Amount validation
    if (
      newTransaction.amount === "" ||
      newTransaction.amount === null ||
      newTransaction.amount === undefined
    ) {
      alert("Please enter an amount.");
      return;
    }

    if (Number(newTransaction.amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    // Description validation
    if (
      !newTransaction.description ||
      !newTransaction.description.trim()
    ) {
      alert("Please enter a description.");
      return;
    }

    // Date validation
    if (!newTransaction.date) {
      alert("Please select a date.");
      return;
    }

    // Type validation
    if (
      newTransaction.type !== "income" &&
      newTransaction.type !== "expense"
    ) {
      alert("Please select a transaction type.");
      return;
    }

    try {
      await handleAddTransaction();
    } catch (error) {
      console.error(
        "Add transaction error:",
        error
      );
    }
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    setShowModal(false);
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-40
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-6
            py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-teal-50
              "
            >
              <Wallet className="h-5 w-5 text-teal-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {title}
              </h2>

              <p className="text-xs text-gray-500">
                Add your income or expense
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
        >
          {/* ==================================================
              TRANSACTION TYPE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* EXPENSE */}

              <button
                type="button"
                onClick={() =>
                  handleTypeChange("expense")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition
                  ${
                    newTransaction.type === "expense"
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <ArrowDownRight className="h-4 w-4" />

                Expense
              </button>

              {/* INCOME */}

              <button
                type="button"
                onClick={() =>
                  handleTypeChange("income")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition
                  ${
                    newTransaction.type === "income"
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <ArrowUpRight className="h-4 w-4" />

                Income
              </button>
            </div>
          </div>

          {/* ==================================================
              AMOUNT
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount
            </label>

            <div className="relative">
              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                ₹
              </span>

              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  py-3
                  pl-9
                  pr-4
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />
            </div>
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={newTransaction.description}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                text-gray-800
                outline-none
                transition
                focus:border-teal-500
                focus:ring-2
                focus:ring-teal-100
              "
            />
          </div>

          {/* ==================================================
              CATEGORY
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={newTransaction.category}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-teal-500
                focus:ring-2
                focus:ring-teal-100
              "
            >
              {newTransaction.type === "expense" ? (
                <>
                  <option value="Food">
                    Food
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Bills">
                    Bills
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Travel">
                    Travel
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </>
              ) : (
                <>
                  <option value="Salary">
                    Salary
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>

                  <option value="Investment">
                    Investment
                  </option>

                  <option value="Gift">
                    Gift
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </>
              )}
            </select>
          </div>

          {/* ==================================================
              DATE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-teal-500
                focus:ring-2
                focus:ring-teal-100
              "
            />
          </div>

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div
            className="
              flex
              gap-3
              border-t
              border-gray-100
              pt-5
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={closeModal}
              className="
                flex-1
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-600
                transition
                hover:bg-gray-50
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              className={`
                flex-1
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                active:scale-[0.98]
                ${
                  newTransaction.type === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-teal-600 hover:bg-teal-700"
                }
              `}
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;