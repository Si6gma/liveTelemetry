// components/MetricControls.jsx
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
        display: "flex",
        gap: "1.5rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      {Object.entries(enabledMetrics).map(([key, val]) => (
        <label
          key={key}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <input
            type="checkbox"
            checked={val}
            onChange={() => toggleMetric(key)}
            style={{ accentColor: colors[key], transform: "scale(1.2)" }}
          />
          <span style={{ color: colors[key], fontWeight: "600" }}>
            {key.toUpperCase()}
          </span>
        </label>
      ))}

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
          marginLeft: "auto",
        }}
        onClick={() => setIsLive(!isLive)}
      >
        {isLive ? "⏸ Pause" : "▶ Resume"}
      </button>
    </div>
  );
}
