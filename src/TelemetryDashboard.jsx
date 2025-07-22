import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ref, onValue, off } from "firebase/database";
import { database } from "./firebase";
import { colors } from "./theme";
import MetricControls from "./components/MetricControls";
import StatDisplay from "./components/StatDisplay";
import MiniMapOverview from "./components/MiniMapOverview";

export default function TelemetryDashboard() {
  const [fullData, setFullData] = useState([]);
  const [enabledMetrics, setEnabledMetrics] = useState({
    rpm: true,
    throttle: true,
    voltage: true,
  });
  const [isLive, setIsLive] = useState(true);
  const [autoPaused, setAutoPaused] = useState(false);
  const [zoomRange, setZoomRange] = useState(null);
  const [selectedStatMetric, setSelectedStatMetric] = useState("rpm");

  const dataRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!zoomRange) return fullData.slice(-100);
    return fullData.filter(
      (d) => d.time >= zoomRange.start && d.time <= zoomRange.end
    );
  }, [fullData, zoomRange]);

  const stats = useMemo(() => {
    const values = filteredData
      .map((d) => d[selectedStatMetric])
      .filter((v) => typeof v === "number");

    if (!values.length) {
      return { min: "-", max: "-", mean: "-" };
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: mean.toFixed(2),
    };
  }, [filteredData, selectedStatMetric]);

  useEffect(() => {
    dataRef.current = ref(database, "telemetry/2025-07-21");

    if (isLive) {
      const unsubscribe = onValue(dataRef.current, (snapshot) => {
        const raw = snapshot.val();
        if (!raw) return;

        const parsed = Object.entries(raw)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([time, values]) => ({
            time,
            rpm: Number(values.rpm),
            throttle: Number(values.throttle),
            voltage: Number(values.voltage),
          }));

        setFullData(parsed);
      });

      return () => off(dataRef.current);
    }
  }, [isLive]);

  const toggleMetric = (key) => {
    setEnabledMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderLines = (sourceData) =>
    Object.entries(enabledMetrics)
      .filter(([, v]) => v)
      .map(([key]) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colors[key]}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          yAxisId={key === "rpm" ? "left" : "right"}
        />
      ));

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
        toggleMetric={toggleMetric}
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

      <StatDisplay
        enabledMetrics={enabledMetrics}
        selectedStatMetric={selectedStatMetric}
        setSelectedStatMetric={setSelectedStatMetric}
        stats={stats}
      />

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "0.5rem",
          borderRadius: "1rem",
        }}
      >
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={filteredData}
            margin={{ top: 0, right: 5, left: 5, bottom: -15 }}
            syncId="telemetry"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={false}
              tickFormatter={(t) => t.slice(-5)}
            />
            <YAxis yAxisId="left" stroke={colors.rpm} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.throttle}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            {renderLines(filteredData)}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <MiniMapOverview
        fullData={fullData}
        enabledMetrics={enabledMetrics}
        onBrushTimeRange={(range) => {
          setZoomRange(range);
          if (isLive) {
            setIsLive(false);
            setAutoPaused(true);
          }
        }}
      />
    </div>
  );
}
