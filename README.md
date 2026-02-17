<!--
Suggested GitHub Topics:
react, firebase, realtime-database, telemetry, data-visualization, plotly, automotive, dashboard, javascript, web-app
-->

# liveTelemetry

A real-time telemetry dashboard for visualizing live vehicle sensor data. Built to monitor racing performance metrics like RPM, throttle position, temperatures, and pressures with an interactive, zoomable chart interface.

## Why It Exists

This project was created to solve the problem of visualizing high-frequency vehicle telemetry data in real-time during racing events. Traditional telemetry tools are often expensive, complex, or require specialized hardware. This dashboard provides a lightweight, web-based solution that:
- Streams data directly from Firebase Realtime Database
- Allows engineers and drivers to analyze performance patterns instantly
- Offers intuitive controls for focusing on specific time windows
- Calculates key statistics (min/max/mean) for quick performance insights

## Tech Stack

- **Frontend:** React 19, JavaScript (ES6+)
- **Data Visualization:** Plotly.js via react-plotly.js
- **Backend/Database:** Firebase Realtime Database
- **Styling:** Inline CSS with custom theme system
- **Build Tool:** Create React App

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

> **Note:** Requires Firebase configuration in `src/firebase.js`. The app expects telemetry data at the `/telemetry/YYYY-MM-DD` path in your Firebase Realtime Database.

## Project Structure

```
liveTelemetry/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── MetricControls.jsx    # Metric toggle buttons
│   │   └── StatDisplay.jsx       # Statistics panel
│   ├── TelemetryDashboard.jsx   # Main dashboard component
│   ├── firebase.js      # Firebase configuration
│   ├── theme.js         # Color schemes and labels
│   ├── App.js           # Root component
│   └── index.js         # Entry point
├── package.json
└── README.md
```

## Key Learnings

- **Real-time data handling:** Implemented efficient Firebase listeners with automatic cleanup to prevent memory leaks, using `onChildAdded` for incremental updates and sliding window buffering (3000-point limit) for performance.

- **Multi-axis visualization:** Solved the challenge of displaying 8 metrics with different scales by dynamically generating Plotly y-axes with color-coded overlays.

- **Interactive zooming:** Built a dual-chart system with a minimap for range selection, enabling users to pause live mode and analyze historical data segments without losing context.

- **React performance optimization:** Used `useMemo` for expensive trace calculations and implemented duplicate detection to handle potential Firebase event re-triggering.

## License

[MIT](LICENSE)
