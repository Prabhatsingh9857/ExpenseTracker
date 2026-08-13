import React from "react";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const GaugeCard = ({
  gauge = {},
  colorInfo = {},
  timeFrameLabel = "",
  highlightNegative = false,
}) => {
  const {
    name = "Metric",
    value = 0,
    max = 100,
  } = gauge;

  // ======================================================
  // NUMERIC VALUES
  // ======================================================

  const numericValue = Number(value) || 0;

  const numericMax =
    Number(max) > 0
      ? Number(max)
      : 100;

  const isNegative = numericValue < 0;

  const absValue = Math.abs(numericValue);

  // ======================================================
  // PERCENTAGE
  // ======================================================

  const percentage = Math.min(
    (absValue / numericMax) * 100,
    100
  );

  const chartValue = Math.min(
    absValue,
    numericMax
  );

  // ======================================================
  // COLORS
  // ======================================================

  const gradientStart = isNegative
    ? "#ef4444"
    : colorInfo?.gradientStart || "#00C49F";

  const gradientEnd = isNegative
    ? "#dc2626"
    : colorInfo?.gradientEnd || "#0088FE";

  const textColor = isNegative
    ? "#dc2626"
    : colorInfo?.textColor || "#1f2937";

  const percentColor = isNegative
    ? "#ef4444"
    : "#6b7280";

  // ======================================================
  // UNIQUE GRADIENT ID
  // ======================================================

  const safeName = String(name)
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  const gradientId =
    `gauge-gradient-${safeName}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  // ======================================================
  // CHART DATA
  // ======================================================

  const chartData = [
    {
      value: chartValue,
    },
  ];

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >

      {/* ==================================================
          TITLE
      ================================================== */}

      <h3
        className="
          mb-2
          text-center
          text-lg
          font-semibold
          text-gray-800
        "
      >
        {name}
      </h3>

      {/* ==================================================
          GAUGE
      ================================================== */}

      <div className="h-48 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="58%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            barSize={18}
          >

            {/* ANGLE AXIS */}

            <PolarAngleAxis
              type="number"
              domain={[0, numericMax]}
              angleAxisId={0}
              tick={false}
              allowDataOverflow
            />

            {/* GAUGE BAR */}

            <RadialBar
              minAngle={15}
              background={{
                fill: "#f3f4f6",
              }}
              dataKey="value"
              cornerRadius={20}
              fill={`url(#${gradientId})`}
            />

            {/* ==================================================
                CENTER VALUE
            ================================================== */}

            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={textColor}
              fontSize="24"
              fontWeight="700"
            >
              {isNegative ? "-" : ""}₹
              {Math.round(absValue).toLocaleString(
                "en-IN"
              )}
            </text>

            {/* ==================================================
                PERCENTAGE
            ================================================== */}

            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={percentColor}
              fontSize="14"
            >
              {Math.round(percentage)}%
            </text>

            {/* ==================================================
                GRADIENT
            ================================================== */}

            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor={gradientStart}
                />

                <stop
                  offset="100%"
                  stopColor={gradientEnd}
                />
              </linearGradient>
            </defs>

          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-1 text-center">

        {isNegative &&
          highlightNegative && (
            <p
              className="
                mb-1
                text-sm
                font-semibold
                text-red-600
              "
            >
              Negative savings
            </p>
          )}

        <p
          className="
            text-xs
            text-gray-400
          "
        >
          {timeFrameLabel} data
        </p>

      </div>

    </div>
  );
};

export default GaugeCard;