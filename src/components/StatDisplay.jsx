import React from "react";
import { colors } from "../theme";

const labels = {
  rpm: "RPM",
  throttle: "Throttle",
  voltage: "Battery Voltage",
  coolant_temp: "Coolant Temp",
  fuel_level: "Fuel Level",
  lambda: "Lambda",
  oil_pressure: "Oil Pressure",
  oil_temp: "Oil Temp",
};

export default function StatDisplay({
  enabledMetrics,
  selectedStatMetric,
  setSelectedStatMetric,
  stats,
  isLive,
  autoPaused,
  setIsLive,
}) {
  const highlightColor = colors[selectedStatMetric] || "#f8fafc";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        padding: "0.75rem 1rem",
        backgroundColor: "#0f172a",
        borderRadius: "0.5rem",
        border: "1px solid #334155",
        color: "#f8fafc",
        fontSize: "0.9rem",
        marginBottom: "1.5rem",
        gap: "1rem",
      }}
    >
      {/* Left: Metric Selector */}
      <div
        style={{
          position: "relative",
          borderRadius: "0.5rem",
          border: `2px solid ${highlightColor}`,
          backgroundColor: "#1e293b",
          overflow: "hidden",
          minWidth: "110px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          padding: "0 0.6rem",
          fontSize: "0.8rem",
          color: "#f8fafc",
        }}
      >
        <select
          value={selectedStatMetric}
          onChange={(e) => setSelectedStatMetric(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundColor: "transparent",
            border: "none",
            color: "inherit",
            fontSize: "inherit",
            fontWeight: "600",
            width: "100%",
            cursor: "pointer",
            paddingRight: "1.2rem",
          }}
        >
          {Object.keys(enabledMetrics).map((key) => (
            <option key={key} value={key} style={{ color: "#000" }}>
              {labels[key] || key}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div
          style={{
            position: "absolute",
            right: "0.6rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            fontSize: "0.65rem",
            color: "#94a3b8",
          }}
        >
          ▼
        </div>
      </div>

      {/* Center: Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {["min", "max", "mean"].map((statKey) => (
          <div
            key={statKey}
            style={{
              backgroundColor: "#1e293b",
              border: `2px solid ${highlightColor}`,
              borderRadius: "0.5rem",
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              minWidth: "90px",
              height: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {statKey.charAt(0).toUpperCase() + statKey.slice(1)}
            </div>
            <div style={{ fontWeight: "600", marginTop: "2px" }}>
              {stats[statKey]}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Pause/Resume Button */}
      <div>
        <button
          style={{
            backgroundColor: autoPaused
              ? "#dc2626"
              : isLive
              ? "#1e293b"
              : "#475569",
            color: "#f1f5f9",
            padding: "0.4rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #334155",
            cursor: "pointer",
            fontSize: "0.85rem",
            minWidth: "110px",
            height: "40px",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
          }}
          onClick={() => setIsLive((prev) => !prev)}
        >
          {isLive ? <>⏸ Pause</> : <>▶ Resume</>}
        </button>
      </div>
    </div>
  );
}
