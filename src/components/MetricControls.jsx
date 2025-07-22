import React from "react";
import { colors } from "../theme";

const labels = {
  rpm: "Engine RPM",
  throttle: "Throttle",
  voltage: "Battery Voltage",
  coolant_temp: "Coolant Temp",
  fuel_level: "Fuel Level",
  lambda: "Air-Fuel Ratio",
  oil_pressure: "Oil Pressure",
  oil_temp: "Oil Temp",
};

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
          {labels[key]}
        </label>
      ))}
    </div>
  );
}
