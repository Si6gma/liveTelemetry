// TelemetryDashboard.jsx

import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { ref, onChildAdded, off } from "firebase/database";

import { database } from "./firebase";
import MetricControls from "./components/MetricControls";
import StatDisplay from "./components/StatDisplay";
import { colors, labels } from "./theme";

// Mapping from UI metric keys to raw Firebase field names
const metricKeyMap = {
  rpm: "rpm",
  throttle: "throttle_position",
  voltage: "voltage",
  coolant_temp: "coolant_temp",
  fuel_level: "fuel_level",
  lambda: "lambda",
  oil_pressure: "oil_pressure",
  oil_temp: "oil_temp",
};

export default function TelemetryDashboard() {
  // ===================
  // STATE
  // ===================
  const [fullData, setFullData] = useState([]);
  const [enabledMetrics, setEnabledMetrics] = useState(
    Object.fromEntries(Object.keys(colors).map((k) => [k, false]))
  );
  const [zoomRange, setZoomRange] = useState(null);
  const [selectedStatMetric, setSelectedStatMetric] = useState("rpm");
  const [isLive, setIsLive] = useState(true);
  const [autoPaused, setAutoPaused] = useState(false);

  // ===================
  // FIREBASE SUBSCRIPTION
  // ===================
  useEffect(() => {
    if (!isLive) return;

    const dataRef = ref(database, "telemetry/2025-07-28");
    const listener = onChildAdded(dataRef, (snapshot) => {
      const values = snapshot.val();
      if (!values) return;

      const entry = {};
      Object.keys(colors).forEach((key) => {
        const rawKey = metricKeyMap[key] || key;
        const num = Number(values[rawKey]);
        entry[key] = isNaN(num) ? null : num;
      });

      setFullData((prev) => {
        const key = snapshot.key;
        if (prev.some((d) => d._key === key)) return prev; // Skip duplicate
        const index = prev.length;
        const newEntry = { ...entry, index, _key: key };
        return [...prev, newEntry].slice(-3000);
      });
    });

    return () => off(dataRef);
  }, [isLive]);

  // ===================
  // MEMOIZED DERIVED DATA
  // ===================
  const filteredData = useMemo(() => {
    if (!zoomRange || fullData.length === 0) return fullData.slice(-100);
    return fullData.filter(
      (d) => d.index >= zoomRange.start && d.index <= zoomRange.end
    );
  }, [fullData, zoomRange]);

  const stats = useMemo(() => {
    const values = filteredData
      .map((d) => d[selectedStatMetric])
      .filter((v) => typeof v === "number");
    if (!values.length) return { min: "-", max: "-", mean: "-" };
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: mean.toFixed(2),
    };
  }, [filteredData, selectedStatMetric]);

  // ===================
  // TRACE GENERATION
  // ===================
  const buildTraces = (data, withAxis = true) =>
    Object.entries(enabledMetrics)
      .filter(([, v]) => v)
      .map(([key], i) => ({
        x: data.map((d) => d.index),
        y: data.map((d) => d[key]),
        type: "scatter",
        mode: "lines",
        name: key,
        line: { color: colors[key], width: 2 },
        yaxis: withAxis ? `y${i + 1}` : "y",
        hovertemplate: `<span style="color:${colors[key]}">●</span> ${
          labels[key] || key
        }: %{y}<extra></extra>`,
      }));

  const mainTraces = useMemo(
    () => buildTraces(filteredData),
    [filteredData, enabledMetrics]
  );
  const miniTraces = useMemo(
    () => buildTraces(fullData, true),
    [fullData, enabledMetrics]
  );

  // ===================
  // DYNAMIC Y AXES
  // ===================
  const mergedYAxes = useMemo(() => {
    const yAxes = Object.keys(enabledMetrics)
      .filter((key) => enabledMetrics[key])
      .map((key, i) => ({
        [`yaxis${i + 1}`]: {
          title: key,
          titlefont: { color: colors[key] },
          tickfont: { color: colors[key] },
          overlaying: i === 0 ? undefined : "y",
          side: i === 0 ? "left" : "right",
          position: i === 0 ? 0 : 1 - (i - 1) * 0.05,
          showticklabels: false,
          showgrid: false,
          zeroline: false,
        },
      }));

    return Object.assign({}, ...yAxes);
  }, [enabledMetrics]);

  const plotLayout = useMemo(
    () => ({
      ...mergedYAxes,
      margin: { t: 20, r: 30, b: 40, l: 40 },
      showlegend: false,
      dragmode: false,
      staticPlot: true,
      plot_bgcolor: "#1e293b",
      paper_bgcolor: "#1e293b",
      font: { color: "#f8fafc" },
      hovermode: "x unified",
      xaxis: {
        visible: false,
        showticklabels: false,
        showgrid: false,
        zeroline: false,
      },
      yaxis: { visible: false, howgrid: false, zeroline: false },
    }),
    [mergedYAxes]
  );

  const miniLayout = useMemo(
    () => ({
      ...mergedYAxes,
      height: 100,
      margin: { t: 0, r: 0, b: 20, l: 0 },
      dragmode: "select",
      showlegend: false,
      plot_bgcolor: "#1e293b",
      paper_bgcolor: "#1e293b",
      font: { color: "#f8fafc" },
      // hovermode: false,
      hovermode: "x unified",
      xaxis: {
        visible: false,
        showticklabels: false,
        showgrid: false,
        fixedrange: true,
        rangeslider: { visible: false },
      },
      yaxis: { visible: false, fixedrange: true },
      selectdirection: "h",
    }),
    [mergedYAxes]
  );

  const plotConfig = useMemo(
    () => ({ responsive: true, displayModeBar: false }),
    []
  );

  // ===================
  // RENDER
  // ===================
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      <MetricControls
        enabledMetrics={enabledMetrics}
        toggleMetric={(key) =>
          setEnabledMetrics((prev) => ({ ...prev, [key]: !prev[key] }))
        }
      />

      <StatDisplay
        enabledMetrics={enabledMetrics}
        selectedStatMetric={selectedStatMetric}
        setSelectedStatMetric={setSelectedStatMetric}
        stats={stats}
        isLive={isLive}
        autoPaused={autoPaused}
        setIsLive={(live) => {
          setIsLive(live);
          if (live) {
            setZoomRange(null);
            setAutoPaused(false);
          }
        }}
      />

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "1rem",
          borderRadius: "0.75rem",
          border: "1px solid #334155",
          marginBottom: "1.5rem",
        }}
      >
        <Plot
          data={mainTraces}
          layout={plotLayout}
          config={plotConfig}
          style={{ width: "100%", height: "450px" }}
        />
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: ".5rem",
          borderRadius: "0.75rem",
          border: "1px solid #334155",
        }}
      >
        <Plot
          data={miniTraces}
          layout={miniLayout}
          config={plotConfig}
          style={{ width: "100%" }}
          onSelected={(e) => {
            if (e?.range?.x) {
              const [start, end] = e.range.x;
              setZoomRange({ start: Math.floor(start), end: Math.ceil(end) });
              setIsLive(false);
              setAutoPaused(true);
            }
          }}
        />
      </div>
    </div>
  );
}
