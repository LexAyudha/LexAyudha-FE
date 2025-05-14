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

// Colors for emotions and emotion classes
const EMOTION_COLORS = [
  "#00C49F", // happy
  "#FF8042", // angry
  "#0088FE", // surprise
  "#FFBB28", // sad
  "#FF8042", // fear
  "#8884D8", // disgust
  "#82CA9D", // neutral
];

const CLASS_COLORS = {
  engagement: "#00C49F",
  frustration: "#FF8042",
  distraction: "#0088FE",
};

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

  // Transform data for all-time emotion distribution bar chart
  const allTimeEmotionData = analyticsData?.allTimeData?.emotions
    ? Object.entries(analyticsData.allTimeData.emotions).map(
        ([emotion, count], index) => ({
          emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          value: (count / analyticsData.allTimeData.total) * 100,
          fill: EMOTION_COLORS[index % EMOTION_COLORS.length],
        })
      )
    : [];

  // Transform data for emotion class pie chart
  const emotionClassData = analyticsData?.allTimeData
    ? [
        { name: "Engagement", value: analyticsData.allTimeData.engagement },
        { name: "Frustration", value: analyticsData.allTimeData.frustration },
        { name: "Distraction", value: analyticsData.allTimeData.distraction },
      ]
    : [];

  // Transform data for all-time emotion trend line chart
  const allTimeTrendData = analyticsData?.allTimeData?.dailyTrend
    ? Object.entries(analyticsData.allTimeData.dailyTrend).map(
        ([date, emotions]) => {
          const total = Object.values(emotions).reduce(
            (sum, count) => sum + count,
            0
          );
          const data = { date };
          Object.entries(emotions).forEach(([emotion, count]) => {
            data[emotion] = (count / total) * 100;
          });
          return data;
        }
      )
    : [];

  // Transform data for emotion class bar chart
  const emotionClassBarData = analyticsData?.allTimeData
    ? [
        {
          class: "Engagement",
          value: analyticsData.allTimeData.engagement,
          fill: CLASS_COLORS.engagement,
        },
        {
          class: "Frustration",
          value: analyticsData.allTimeData.frustration,
          fill: CLASS_COLORS.frustration,
        },
        {
          class: "Distraction",
          value: analyticsData.allTimeData.distraction,
          fill: CLASS_COLORS.distraction,
        },
      ]
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          {emotionClassData.map((item) => (
            <div
              key={item.name}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <p className="text-sm text-gray-500">{item.name}</p>
              <p className="text-xl font-semibold">{item.value.toFixed(2)}%</p>
            </div>
          ))}
        </div>

        {/* All-time Emotion Distribution Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2 text-center">
            All-Time Emotion Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allTimeEmotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {allTimeEmotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two charts side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Emotion Class Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">
              All-Time Emotion Class Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emotionClassData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionClassData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(CLASS_COLORS)[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* All-time Emotion Trend Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">All-Time Emotion Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={allTimeTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {allTimeEmotionData.map((item, index) => (
                  <Line
                    key={item.emotion}
                    type="monotone"
                    dataKey={item.emotion.toLowerCase()}
                    stroke={EMOTION_COLORS[index % EMOTION_COLORS.length]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotion Class Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow max-w-3xl mx-auto">
          <h2 className="font-semibold mb-2 text-center">
            All-Time Emotion Class Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionClassBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {emotionClassBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Summary */}
        <div className="mt-5">
          {" "}
          {analyticsData?.studentSummary && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Student Progress Summary
              </h2>
              <div className="prose max-w-none">
                {analyticsData.studentSummary
                  .split("\n")
                  .map((paragraph, index) => {
                    // Check if paragraph is a section header
                    if (
                      paragraph.startsWith("1. **Summary:**") ||
                      paragraph.startsWith(
                        "2. **Key Areas of Improvement:**"
                      ) ||
                      paragraph.startsWith(
                        "3. **Recommendations for Better Engagement:**"
                      )
                    ) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-semibold text-gray-700 mt-4 mb-2"
                        >
                          {paragraph.replace(/^\d+\.\s+\*\*|\*\*:$/g, "")}
                        </h3>
                      );
                    }
                    // Check if paragraph is a bullet point
                    else if (paragraph.trim().startsWith("*")) {
                      return (
                        <ul key={index} className="list-disc pl-6 mb-4">
                          <li className="text-gray-600 mb-2">
                            {paragraph.replace(/^\*\s+/, "")}
                          </li>
                        </ul>
                      );
                    }
                    // Regular paragraph
                    else if (paragraph.trim()) {
                      return (
                        <p key={index} className="text-gray-600 mb-4">
                          {paragraph}
                        </p>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalytics;
