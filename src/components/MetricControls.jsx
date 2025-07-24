import React from "react";
import { colors, labels } from "../theme";

export default function MetricControls({ enabledMetrics, toggleMetric }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      {Object.keys(colors).map((key) => {
        const isEnabled = enabledMetrics[key];
        const color = colors[key];

        return (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              fontWeight: "600",
              borderRadius: "8px",
              border: `2px solid ${isEnabled ? color : "#1e293b"}`,
              backgroundColor: isEnabled ? `${color}22` : "#1e293b",
              color,
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              outline: "none",
            }}
          >
            {/* Hidden checkbox for accessibility (optional) */}
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => toggleMetric(key)}
              style={{ display: "none" }}
            />
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
}
