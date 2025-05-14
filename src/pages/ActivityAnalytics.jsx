"use client";
import React, { useState, useEffect } from "react";
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

const EmotionAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState("2025-05-15");
  const [selectedActivity, setSelectedActivity] = useState("2468");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock activities - replace with actual data from your backend
  const activities = [
    { id: "2468", name: "Number Recognition" },
    { id: "2", name: "Addition Practice" },
    { id: "3", name: "Subtraction Practice" },
  ];

  const fetchAnalyticsData = async () => {
    if (!selectedDate || !selectedActivity) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8005/emotion/analytics?date=${selectedDate}&activityId=${selectedActivity}&studentId=12345678`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data:", data);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDate, selectedActivity]);

  // Transform data for pie chart
  const allTimeEmotionData = analyticsData?.allTimeData
    ? [
        { name: "Engagement", value: analyticsData.allTimeData.engagement },
        { name: "Frustration", value: analyticsData.allTimeData.frustration },
        { name: "Distraction", value: analyticsData.allTimeData.distraction },
      ]
    : [];

  // Transform data for line chart
  const hourlyLineData = analyticsData?.hourlyData
    ? analyticsData.hourlyData.map((item) => ({
        time: `${item.hour}:00`,
        engagement: item.percentages.engagement,
        frustration: item.percentages.frustration,
        distraction: item.percentages.distraction,
      }))
    : [];

  // Transform data for bar chart
  const hourlyBarData = analyticsData?.hourlyData
    ? analyticsData.hourlyData.map((item) => ({
        hour: `${item.hour}:00`,
        engagement: item.percentages.engagement,
        frustration: item.percentages.frustration,
        distraction: item.percentages.distraction,
      }))
    : [];

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
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded-md shadow-sm"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6 text-center">
          <div>
            <p className="text-sm text-gray-500">Engagement</p>
            <p className="text-xl font-semibold">
              {analyticsData?.allTimeData?.engagement.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Frustration</p>
            <p className="text-xl font-semibold">
              {analyticsData?.allTimeData?.frustration.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distraction</p>
            <p className="text-xl font-semibold">
              {analyticsData?.allTimeData?.distraction.toFixed(1)}%
            </p>
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
                <Line type="monotone" dataKey="distraction" stroke="#0088FE" />
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
