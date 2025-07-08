// src/components/DonationGraph.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DonationGraph = ({ donationHistory }) => {
  // Format donationHistory to graph-friendly data
  const dataMap = {};

  donationHistory.forEach(({ timestamp, bottleCount }) => {
    const dateKey = timestamp.toLocaleDateString(); // Format: "7/5/2025"
    if (dataMap[dateKey]) {
      dataMap[dateKey] += bottleCount;
    } else {
      dataMap[dateKey] = bottleCount;
    }
  });

  // 💡 Sort dates from oldest to newest (left → right)
  const graphData = Object.keys(dataMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date,
      bottles: dataMap[date],
    }));

  return (
    <div className="card bg-dark p-4 shadow mt-4 text-white">
      <h5 className="text-success mb-3">📈 Bottles Donated Over Time</h5>
      {graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--subtext-color)" />
            <XAxis dataKey="date" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" />
            <Tooltip
              labelStyle={{ color: "var(--text-color)" }}
              itemStyle={{ color: "var(--text-color)" }}
              contentStyle={{ backgroundColor: "var(--card-bg)", borderRadius: "8px" }}
            />
            <Line
              type="monotone"
              dataKey="bottles"
              stroke="#00ff88"
              strokeWidth={2}
              dot={{ fill: "#00ff88" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-light">No donations yet to show on graph.</p>
      )}
    </div>
  );
};

export default DonationGraph;
