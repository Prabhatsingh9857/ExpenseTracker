import React from "react";

const TransactionItem = ({
  transaction,
  isEditing = false,
  editForm = {},
  setEditForm = () => {},
  onSave = () => {},
  onCancel = () => {},
  onDelete = () => {},
  type = "income",
  categoryIcons = {},
  setEditingId = () => {},
}) => {
  const transactionId =
    transaction?._id || transaction?.id;

  const isIncome = type === "income";

  // ==============================
  // EDIT MODE
  // ==============================

  if (isEditing) {
    return (
      <div className="border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {/* DESCRIPTION */}
          <input
            type="text"
            value={editForm.description || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />

          {/* AMOUNT */}
          <input
            type="number"
            value={editForm.amount || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                amount: e.target.value,
              })
            }
            placeholder="Amount"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />

          {/* CATEGORY */}
          <select
            value={editForm.category || "Other"}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                category: e.target.value,
              })
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          >
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investment">Investment</option>
            <option value="Bonus">Bonus</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>

          {/* DATE */}
          <input
            type="date"
            value={
              editForm.date
                ? String(editForm.date).slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setEditForm({
                ...editForm,
                date: e.target.value,
              })
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // NORMAL TRANSACTION
  // ==============================

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0">

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">

        {/* ICON */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isIncome
              ? "bg-green-50"
              : "bg-red-50"
          }`}
        >
          {categoryIcons?.[transaction?.category] || (
            <span
              className={`text-lg font-bold ${
                isIncome
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              ₹
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-gray-800">
            {transaction?.description ||
              "Transaction"}
          </p>

          <p className="text-xs text-gray-500">
            {transaction?.category || "Other"}
          </p>

          <p className="text-xs text-gray-400">
            {transaction?.date
              ? new Date(
                  transaction.date
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div className="shrink-0 text-right">

        {/* AMOUNT */}
        <p
          className={`text-sm font-bold ${
            isIncome
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}₹
          {Number(
            transaction?.amount || 0
          ).toLocaleString("en-IN")}
        </p>

        {/* ACTIONS */}
        <div className="mt-1 flex justify-end gap-3">

          <button
            type="button"
            onClick={() => {
              setEditForm({
                description:
                  transaction?.description || "",
                amount:
                  transaction?.amount || "",
                category:
                  transaction?.category || "Other",
                date: transaction?.date
                  ? String(
                      transaction.date
                    ).slice(0, 10)
                  : "",
              });

              setEditingId(transactionId);
            }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(transactionId)
            }
            className="text-xs font-medium text-red-500 hover:underline"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default TransactionItem;