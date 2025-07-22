import React, { useEffect, useState, useRef, useMemo } from "react";
import Plot from "react-plotly.js";
import { ref, onValue, off } from "firebase/database";
import { database } from "./firebase";
import MetricControls from "./components/MetricControls";
import StatDisplay from "./components/StatDisplay";
import { colors } from "./theme";

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
  const [fullData, setFullData] = useState([]);
  const [enabledMetrics, setEnabledMetrics] = useState(
    Object.fromEntries(Object.keys(colors).map((k) => [k, false]))
  );
  const [zoomRange, setZoomRange] = useState(null);
  const [selectedStatMetric, setSelectedStatMetric] = useState("rpm");
  const [isLive, setIsLive] = useState(true);
  const [autoPaused, setAutoPaused] = useState(false);

  const filteredData = useMemo(() => {
    if (!zoomRange || fullData.length === 0) {
      return fullData.slice(-100).map((d, i) => ({ ...d, index: i }));
    }
    return fullData
      .map((d, i) => ({ ...d, index: i }))
      .filter((d) => d.index >= zoomRange.start && d.index <= zoomRange.end);
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

  useEffect(() => {
    const dataRef = ref(database, "telemetry/2025-07-22");
    if (isLive) {
      const unsubscribe = onValue(dataRef, (snapshot) => {
        const raw = snapshot.val();
        if (!raw) return;

        const parsed = Object.entries(raw)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([_, values], i) => {
            const entry = { index: i };
            Object.keys(colors).forEach((key) => {
              const rawKey = metricKeyMap[key] || key;
              const raw = values[rawKey];
              const num = Number(raw);
              entry[key] = isNaN(num) ? null : num;
            });
            return entry;
          });

        setFullData(parsed.slice(-3000));
      });

      return () => off(dataRef);
    }
  }, [isLive]);

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
        hovertemplate: `${key}: %{y}<extra></extra>`,
      }));

  const yAxes = Object.keys(enabledMetrics)
    .filter((key) => enabledMetrics[key])
    .map((key, i) => {
      return {
        [`yaxis${i + 1}`]: {
          title: key,
          titlefont: { color: colors[key] },
          tickfont: { color: colors[key] },
          overlaying: i === 0 ? undefined : "y",
          side: i === 0 ? "left" : "right",
          position: i === 0 ? 0 : 1 - (i - 1) * 0.05,
          showticklabels: false,
          showgrid: false,
        },
      };
    });

  const mergedYAxes = Object.assign({}, ...yAxes);

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

      <Plot
        data={buildTraces(filteredData)}
        layout={{
          ...mergedYAxes,
          margin: { t: 20, r: 30, b: 40, l: 40 },
          showlegend: false,
          dragmode: "pan",
          plot_bgcolor: "#1e293b",
          paper_bgcolor: "#1e293b",
          font: { color: "#f8fafc" },
          xaxis: {
            visible: false,
            showticklabels: false,
            showgrid: false,
            zeroline: false,
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "500px" }}
      />

      <Plot
        data={buildTraces(fullData, true)}
        layout={{
          ...mergedYAxes,
          height: 150,
          margin: { t: 0, r: 0, b: 30, l: 30 },
          showlegend: false,
          dragmode: "select",
          plot_bgcolor: "#1e293b",
          paper_bgcolor: "#1e293b",
          font: { color: "#f8fafc" },
          xaxis: {
            visible: false,
            showticklabels: false,
            showgrid: false,
            rangeslider: { visible: false },
          },
          selectdirection: "h",
        }}
        onSelected={(e) => {
          if (e?.range?.x) {
            const [start, end] = e.range.x;
            setZoomRange({ start: Math.floor(start), end: Math.ceil(end) });
            setIsLive(false);
            setAutoPaused(true);
          }
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
