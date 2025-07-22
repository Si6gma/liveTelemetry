// components/StatDisplay.jsx
import React from "react";

export default function StatDisplay({
  enabledMetrics,
  selectedStatMetric,
  setSelectedStatMetric,
  stats,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        padding: "0.75rem 1rem",
        backgroundColor: "#0f172a",
        borderRadius: "0.5rem",
        border: "1px solid #334155",
        color: "#f8fafc",
        fontSize: "0.95rem",
        marginBottom: "1.5rem",
      }}
    >
      <label style={{ fontWeight: "500" }}>Metric:</label>
      <select
        value={selectedStatMetric}
        onChange={(e) => setSelectedStatMetric(e.target.value)}
        style={{
          padding: "0.4rem 0.6rem",
          borderRadius: "0.375rem",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #475569",
        }}
      >
        {Object.keys(enabledMetrics).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <span>
          <strong>Min:</strong> {stats.min}
        </span>
        <span>
          <strong>Max:</strong> {stats.max}
        </span>
        <span>
          <strong>Mean:</strong> {stats.mean}
        </span>
      </div>
    </div>
  );
}
