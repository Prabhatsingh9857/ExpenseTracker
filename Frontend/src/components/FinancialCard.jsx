import React from "react";

const FinancialCard = ({
  icon = null,
  label = "",
  value = "₹0",
  additionalContent = null,
  borderColor = "",
  bgColor = "bg-white",
}) => {
  return (
    <div
      className={`
        ${bgColor}
        ${borderColor}
        w-full
        rounded-xl
        border
        border-gray-100
        p-5
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
      `}
    >
      <div className="flex items-center gap-3">

        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            {icon}
          </div>
        )}

        <span className="text-sm font-medium text-gray-600">
          {label}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold text-gray-800">
        {value}
      </p>

      {additionalContent && (
        <div className="mt-2">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default FinancialCard;