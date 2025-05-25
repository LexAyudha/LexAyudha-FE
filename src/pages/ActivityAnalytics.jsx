"use client";
import React, { useState, useEffect, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Modal, Input, message } from "antd";

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
  const reportRef = useRef(null);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

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

  // Transform data for selected date's emotion distribution
  const selectedDateEmotionData = analyticsData?.dailyData
    ? Object.entries(
        analyticsData.dailyData.reduce((acc, entry) => {
          const emotion = entry.Emotion;
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {})
      ).map(([emotion, count], index) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: (count / analyticsData.dailyData.length) * 100,
        fill: EMOTION_COLORS[index % EMOTION_COLORS.length],
      }))
    : [];

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      setLoading(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Add header
      pdf.setFontSize(20);
      pdf.text("Student Emotion Analytics Report", pdfWidth / 2, 20, { align: "center" });

      // Add footer
      const footerText = `Generated on ${new Date().toLocaleDateString()}`;
      pdf.setFontSize(10);
      pdf.text(footerText, pdfWidth / 2, pdfHeight - 10, { align: "center" });

      // Save the PDF
      pdf.save(`emotion-analytics-report-${selectedDate}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !reportRef.current) return;

    try {
      setSendingEmail(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');

      // Add header
      pdf.setFontSize(20);
      pdf.text("Student Emotion Analytics Report", pdfWidth / 2, 20, { align: "center" });

      // Add footer
      const footerText = `Generated on ${new Date().toLocaleDateString()}`;
      pdf.setFontSize(10);
      pdf.text(footerText, pdfWidth / 2, pdfHeight - 10, { align: "center" });

      // Get PDF as base64 string with compression
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      // Prepare email content
      const activityName = activities.find(a => a.id === selectedActivity)?.name || "Unknown Activity";
      const emailSubject = `Emotion Analytics Report - ${activityName} (${selectedDate})`;
      
      const emailText = `
Emotion Analytics Report
Activity: ${activityName}
Date: ${selectedDate}

Total Sessions: ${analyticsData?.allTimeData?.total || 0}

Summary:
${analyticsData?.studentSummary || "No summary available"}

This report has been generated based on the student's emotional responses during the activity.

Please find the detailed PDF report attached to this email.
      `;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Emotion Analytics Report</h2>
          <div style="margin: 20px 0;">
            <p><strong>Activity:</strong> ${activityName}</p>
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Total Sessions:</strong> ${analyticsData?.allTimeData?.total || 0}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #444;">Summary</h3>
            <div style="white-space: pre-line;">
              ${analyticsData?.studentSummary || "No summary available"}
            </div>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This report has been generated based on the student's emotional responses during the activity.
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 10px;">
              Please find the detailed PDF report attached to this email.
            </p>
          </div>
        </div>
      `;

      // Send email with PDF attachment
      const response = await fetch("http://localhost:8007/email/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
          attachments: [{
            content: pdfBase64,
            filename: `emotion-analytics-report-${selectedDate}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      message.success("Report sent successfully!");
      setIsEmailModalVisible(false);
      setEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Failed to send report. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title and Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">
            Student Emotion Analytics by Activity
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEmailModalVisible(true)}
              disabled={loading || !analyticsData}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading || !analyticsData
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Send Report
            </button>
            <button
              onClick={generatePDF}
              disabled={loading || !analyticsData}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading || !analyticsData
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating PDF..." : "Download Report"}
            </button>
          </div>
        </div>

        {/* Date & Activity Selectors */}
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

        {/* Report Content */}
        <div ref={reportRef} className="bg-white p-6 rounded-lg shadow">
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

          {/* Selected Date's Emotion Distribution Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-2 text-center">
              Selected Date's Emotion Distribution ({selectedDate})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedDateEmotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {selectedDateEmotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
            {analyticsData?.studentSummary && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Student Progress Summary
                </h2>
                <div className="prose max-w-none">
                  {analyticsData.studentSummary
                    .split("\n")
                    .map((paragraph, index) => {
                      if (
                        paragraph.startsWith("1. **Summary:**") ||
                        paragraph.startsWith("2. **Key Areas of Improvement:**") ||
                        paragraph.startsWith("3. **Recommendations for Better Engagement:**")
                      ) {
                        return (
                          <h3
                            key={index}
                            className="text-lg font-semibold text-gray-700 mt-4 mb-2"
                          >
                            {paragraph.replace(/^\d+\.\s+\*\*|\*\*:$/g, "")}
                          </h3>
                        );
                      } else if (paragraph.trim().startsWith("*")) {
                        return (
                          <ul key={index} className="list-disc pl-6 mb-4">
                            <li className="text-gray-600 mb-2">
                              {paragraph.replace(/^\*\s+/, "")}
                            </li>
                          </ul>
                        );
                      } else if (paragraph.trim()) {
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

        {/* Email Modal */}
        <Modal
          title="Send Report via Email"
          open={isEmailModalVisible}
          onOk={handleSendEmail}
          onCancel={() => {
            setIsEmailModalVisible(false);
            setEmail("");
          }}
          confirmLoading={sendingEmail}
        >
          <div className="p-4">
            <p className="mb-4">Enter the recipient's email address:</p>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EmotionAnalytics;
