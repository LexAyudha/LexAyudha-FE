"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

const allTimeEmotionData = [
  { name: "Engagement", value: 33.3 },
  { name: "Frustration", value: 66.7 },
  { name: "Distraction", value: 0 },
];

const hourlyLineData = [
  { time: "0:00", engagement: 30, frustration: 70 },
  { time: "1:00", engagement: 45, frustration: 55 },
  { time: "2:00", engagement: 60, frustration: 40 },
];

const hourlyBarData = [
  { hour: "0:00", engagement: 30, frustration: 70, distraction: 0 },
  { hour: "1:00", engagement: 45, frustration: 45, distraction: 10 },
  { hour: "2:00", engagement: 50, frustration: 30, distraction: 20 },
];

const EmotionAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Student Emotion Analytics by Activity
        </h1>

        {/* Date & Activity */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <input
            type="date"
            className="border px-4 py-2 rounded-md shadow-sm"
            defaultValue="2025-05-15"
          />
          <select className="border px-4 py-2 rounded-md shadow-sm">
            <option>Number Recognition</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6 text-center">
          <div>
            <p className="text-sm text-gray-500">Engagement</p>
            <p className="text-xl font-semibold">33.3%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Frustration</p>
            <p className="text-xl font-semibold">66.7%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distraction</p>
            <p className="text-xl font-semibold">0%</p>
          </div>
        </div>

        {/* Two charts side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">
              All-Time Emotion Distribution (Pie)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allTimeEmotionData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allTimeEmotionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Hourly Emotion Trend (Line)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#00C49F" />
                <Line type="monotone" dataKey="frustration" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Centered */}
        <div className="bg-white p-4 rounded-lg shadow max-w-3xl mx-auto">
          <h2 className="font-semibold mb-2 text-center">
            Hourly Emotion Comparison (Bar)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement" fill="#00C49F" />
              <Bar dataKey="frustration" fill="#FF8042" />
              <Bar dataKey="distraction" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalytics;
