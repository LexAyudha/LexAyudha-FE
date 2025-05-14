import React, { useState, useEffect } from "react";
import { DatePicker, Select, Card, Row, Col } from "antd";
import { Pie, Bar, Line } from "@ant-design/plots";
import dayjs from "dayjs";

const { Option } = Select;

const ActivityAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedActivity, setSelectedActivity] = useState(null);
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
        `http://localhost:8005/emotion/analytics?date=${selectedDate.format(
          "YYYY-MM-DD"
        )}&activityId=${selectedActivity}&studentId=12345678`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDate, selectedActivity]);

  const pieConfig = {
    data: analyticsData?.allTimeData
      ? [
          { type: "Engagement", value: analyticsData.allTimeData.engagement },
          { type: "Frustration", value: analyticsData.allTimeData.frustration },
          { type: "Distraction", value: analyticsData.allTimeData.distraction },
        ]
      : [],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  const lineConfig = {
    data:
      analyticsData?.hourlyData?.map((item) => ({
        hour: `${item.hour}:00`,
        engagement: item.percentages.engagement,
        frustration: item.percentages.frustration,
        distraction: item.percentages.distraction,
      })) || [],
    xField: "hour",
    yField: "value",
    seriesField: "type",
    point: {
      size: 5,
      shape: "diamond",
    },
  };

  const barConfig = {
    data:
      analyticsData?.hourlyData?.map((item) => ({
        hour: `${item.hour}:00`,
        engagement: item.percentages.engagement,
        frustration: item.percentages.frustration,
        distraction: item.percentages.distraction,
      })) || [],
    xField: "hour",
    yField: "value",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            value={selectedActivity}
            onChange={setSelectedActivity}
            style={{ width: 200 }}
            placeholder="Select Activity"
          >
            {activities.map((activity) => (
              <Option key={activity.id} value={activity.id}>
                {activity.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="All-Time Emotion Distribution" loading={loading}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Hourly Emotion Trends" loading={loading}>
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="Hourly Emotion Comparison" loading={loading}>
            <Bar {...barConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ActivityAnalytics;
