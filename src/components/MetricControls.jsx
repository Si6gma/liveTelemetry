import React from "react";
import { colors } from "../theme";

export default function MetricControls({
  enabledMetrics,
  toggleMetric,
  isLive,
  autoPaused,
  setIsLive,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "0.75rem 1.5rem",
        marginBottom: "1rem",
        alignItems: "center",
      }}
    >
      {Object.keys(colors).map((key) => (
        <label
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            color: colors[key],
          }}
        >
          <input
            type="checkbox"
            checked={enabledMetrics[key]}
            onChange={() => toggleMetric(key)}
            style={{
              accentColor: colors[key],
              transform: "scale(1.2)",
              cursor: "pointer",
            }}
          />
          {key.toUpperCase()}
        </label>
      ))}

      <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
        <button
          style={{
            backgroundColor: autoPaused
              ? "#dc2626"
              : isLive
              ? "#1e293b"
              : "#475569",
            color: "#f1f5f9",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #334155",
            cursor: "pointer",
          }}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? "⏸ Pause" : "▶ Resume"}
        </button>
      </div>
    </div>
  );
}
