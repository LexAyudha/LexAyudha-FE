import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress, Statistic, Row, Col, Spin, Radio } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axiosInstance from '../api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from '../api/RecurringAPI'
import DysRecordPdf from './dysRecordPdf';

const DashPerformance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('dyscalculia'); // 'dyscalculia' or 'dyslexia'
  const [performanceData, setPerformanceData] = useState({
    totalSessions: 0,
    averageEngagement: 0,
    averageFrustration: 0,
    averageDistraction: 0,
    recentTrend: []
  });
  const [dysReportsList, setDysReportList] = useState([])
  const [reportPreview, setReportPreview] = useState(false)
  const [reportObj, setReportObj] = useState(null)

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userData'],
    queryFn: () => getUserDetails(),
  });

  useEffect(() => {
    if (reportObj !== null) {
      setReportPreview(true)
    } else {
      setReportPreview(false)
    }

  }, [reportObj]);

  useEffect(() => {
    if (!reportPreview) {
      setReportObj(null)
    }
  }, [reportPreview]);

  useEffect(() => {
    // Fetch performance data
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'http://localhost:8005/emotion/analytics?date=2025-05-15&activityId=2468&studentId=12345678'
        );
        const data = await response.json();

        // Transform data for dashboard
        setPerformanceData({
          totalSessions: data.allTimeData?.total || 0,
          averageEngagement: data.allTimeData?.engagement || 0,
          averageFrustration: data.allTimeData?.frustration || 0,
          averageDistraction: data.allTimeData?.distraction || 0,
          recentTrend: Object.entries(data.allTimeData?.dailyTrend || {}).map(([date, emotions]) => ({
            date,
            engagement: emotions.happy || 0,
            frustration: emotions.angry || 0,
            distraction: emotions.surprise || 0
          })).slice(-7) // Last 7 days
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  useEffect(() => {

    getDyslexicRecords()
  }, [user]);

  const getDyslexicRecords = async () => {
    try {

      const res = await axiosInstance.get(`/user/records/${user?._id}`)
      if (res?.status === 200) {
        console.log('DysReports: ', res?.data)
        setDysReportList(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const openDysReportPdf = (index) => {
    setReportObj(dysReportsList[index])
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spin size="large" tip="Loading performance data...">
          <div className="content" style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }} />
        </Spin>
      </div>
    );
  }

  // Dyslexia Report View
  if (reportType === 'dyslexia') {
    return (
      <div className="p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dyslexia Quiz Reports</h1>
          <Radio.Group
            value={reportType}
            onChange={handleReportTypeChange}
            buttonStyle="solid"
          >
            <Radio.Button value="dyscalculia">Dyscalculia</Radio.Button>
            <Radio.Button value="dyslexia">Dyslexia</Radio.Button>
          </Radio.Group>
        </div>
        <Card className='h-full'>
          {reportPreview ? (
            <div className='flex justify-center items-start'>
              <DysRecordPdf record={reportObj} closeWindow={() => setReportPreview(false)} />
            </div>
            
          ) : (
            <div className="text-center h-full min-h-[220px] overflow-y-auto flex-wrap w-full py-2 px-2 flex justify-between items-start">
            {dysReportsList.length > 0 ? (
              dysReportsList.map((report, index) => (

              <div key={index} onClick={() => openDysReportPdf(index)} className='mb-[12px] h-[80px] flex cursor-pointer group rounded-lg shadow-[0px_0px_4px_2px_rgba(0,0,0,0.1)] py-2 px-2 justify-center items-center w-[calc(33.333%-0.5rem)]'>
                <div className=' h-full flex w-full justify-center items-center'>
                  <p className='m-0 text-xl font-bold text-gray-500 group-hover:text-black'>{report?.name}_{report?._id?.substring(0, 6)}</p>
                </div>
                <div className='flex w-1/3 flex-col text-gray-500 group-hover:text-black'>
                  <p className='text-lg '>
                    {new Date(report?.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'UTC'
                    })}
                  </p>

                  <p className='text-xs'>{new Date(report?.createdAt).toISOString().split('T')[0]}</p>
                </div>
              </div>
            ))
            ):(
              <div className=' flex text-wrap h-full min-h-[180px] w-full items-center justify-center'>
                <p className='text-gray-500 m-0'>No Records available at the moment.</p>
              </div>
            )}
           
          </div>
          )}
          
        </Card>
      </div>
    );
  }

  // Dyscalculia Report View (Current Implementation)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dyscalculia Progress</h1>
        <div className="flex items-center gap-4">
          <Radio.Group
            value={reportType}
            onChange={handleReportTypeChange}
            buttonStyle="solid"
          >
            <Radio.Button value="dyscalculia">Dyscalculia</Radio.Button>
            <Radio.Button value="dyslexia">Dyslexia</Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            size="large"
            onClick={handleViewAnalytics}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Detailed Analytics
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sessions"
              value={performanceData.totalSessions}
              suffix="sessions"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Engagement"
              value={performanceData.averageEngagement}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Frustration"
              value={performanceData.averageFrustration}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Distraction"
              value={performanceData.averageDistraction}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Bars */}
      <Card title="Emotion Distribution" className="mb-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Engagement</span>
              <span>{performanceData.averageEngagement}%</span>
            </div>
            <Progress
              percent={performanceData.averageEngagement}
              strokeColor="#3f8600"
              showInfo={false}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Frustration</span>
              <span>{performanceData.averageFrustration}%</span>
            </div>
            <Progress
              percent={performanceData.averageFrustration}
              strokeColor="#cf1322"
              showInfo={false}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Distraction</span>
              <span>{performanceData.averageDistraction}%</span>
            </div>
            <Progress
              percent={performanceData.averageDistraction}
              strokeColor="#faad14"
              showInfo={false}
            />
          </div>
        </div>
      </Card>

      {/* Recent Trend Chart */}
      <Card title="7-Day Emotion Trend" className="mb-6">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={performanceData.recentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#3f8600"
                name="Engagement"
              />
              <Line
                type="monotone"
                dataKey="frustration"
                stroke="#cf1322"
                name="Frustration"
              />
              <Line
                type="monotone"
                dataKey="distraction"
                stroke="#faad14"
                name="Distraction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-6">
        <div className="flex flex-wrap gap-4">
          <Button
            type="primary"
            onClick={handleViewAnalytics}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Full Analytics
          </Button>
          <Button
            onClick={() => navigate('/analytics')}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Download Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashPerformance;