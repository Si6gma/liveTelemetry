// components/MiniMapOverview.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
} from "recharts";
import { colors } from "../theme";

export default function MiniMapOverview({
  fullData,
  enabledMetrics,
  onBrushTimeRange,
}) {
  console.log("[MiniMapOverview] Full data updated:", fullData.length);

  const renderLines = () => {
    const keys = Object.entries(enabledMetrics)
      .filter(([, v]) => v)
      .map(([key]) => key);
    console.log("[MiniMapOverview] Rendering lines:", keys);

    return keys.map((key) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colors[key]}
        strokeWidth={1}
        dot={false}
        isAnimationActive={false}
        yAxisId={key === "rpm" ? "left" : "right"}
      />
    ));
  };

  const handleBrushChange = (e) => {
    console.log("[MiniMapOverview] Brush change event:", e);
    if (
      typeof e?.startIndex !== "number" ||
      typeof e?.endIndex !== "number" ||
      !fullData.length
    )
      return;

    const start = fullData[e.startIndex]?.time;
    const end = fullData[e.endIndex]?.time;
    if (start && end && typeof onBrushTimeRange === "function") {
      console.log("[MiniMapOverview] Selected time range:", { start, end });
      onBrushTimeRange({ start, end });
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        backgroundColor: "#1e293b",
        padding: "1rem",
        borderRadius: "1rem",
      }}
    >
      {/* 🆕 Isolate the container to decouple from main chart */}
      <div id="overview-container">
        <ResponsiveContainer width="100%" height={200} key="overview">
          <LineChart
            data={fullData.slice()} // clone to avoid shared references
            isAnimationActive={false}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(t) => t.slice(-5)}
            />
            <YAxis yAxisId="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />
            {renderLines()}
            <Brush
              dataKey="time"
              height={30}
              stroke="#64748b"
              travellerWidth={10}
              travellerStroke="#94a3b8"
              fill="#1e293b"
              onChange={handleBrushChange}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
