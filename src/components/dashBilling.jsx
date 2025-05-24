import React, { useState } from 'react';
import { Card, Button, Table, Tag, Progress, Row, Col, Statistic } from 'antd';
import { 
  DollarOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const DashBilling = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual data from your backend
  const subscriptionData = {
    plan: "Premium",
    status: "active",
    nextBillingDate: "2024-06-15",
    amount: 29.99,
    billingCycle: "monthly",
    features: [
      "Unlimited Access to All Activities",
      "Progress Tracking",
      "Detailed Analytics",
      "Email Reports",
      "Priority Support"
    ]
  };

  const paymentHistory = [
    {
      key: '1',
      date: '2024-05-15',
      amount: 29.99,
      status: 'completed',
      method: 'Credit Card',
      invoice: 'INV-2024-001'
    },
    {
      key: '2',
      date: '2024-04-15',
      amount: 29.99,
      status: 'completed',
      method: 'Credit Card',
      invoice: 'INV-2024-002'
    },
    {
      key: '3',
      date: '2024-03-15',
      amount: 29.99,
      status: 'completed',
      method: 'Credit Card',
      invoice: 'INV-2024-003'
    }
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      render: (invoice) => (
        <Button type="link" onClick={() => window.open(`/invoices/${invoice}`, '_blank')}>
          {invoice}
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <Button type="primary" icon={<CreditCardOutlined />}>
          Update Payment Method
        </Button>
      </div>

      {/* Subscription Overview */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Current Plan"
              value={subscriptionData.plan}
              prefix={<DollarOutlined />}
            />
            <Tag color="green" className="mt-2">
              {subscriptionData.status.toUpperCase()}
            </Tag>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Next Billing Date"
              value={subscriptionData.nextBillingDate}
              prefix={<ClockCircleOutlined />}
            />
            <p className="text-gray-500 mt-2">
              ${subscriptionData.amount} / {subscriptionData.billingCycle}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Days Until Renewal"
              value={30}
              suffix="days"
              prefix={<CheckCircleOutlined />}
            />
            <Progress percent={70} status="active" className="mt-2" />
          </Card>
        </Col>
      </Row>

      {/* Plan Features */}
      <Card title="Plan Features" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptionData.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment History */}
      <Card 
        title="Payment History" 
        className="mb-6"
        extra={
          <Button type="link">
            Download All Invoices
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={paymentHistory}
          pagination={false}
        />
      </Card>

      {/* Billing Information */}
      <Card title="Billing Information" className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <div className="flex items-center">
                <CreditCardOutlined className="text-2xl mr-2" />
                <span>•••• •••• •••• 4242</span>
                <Button type="link" className="ml-4">
                  Change
                </Button>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
              <p>123 Education Street</p>
              <p>Learning City, LC 12345</p>
              <Button type="link" className="mt-2">
                Update
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Support Section */}
      <Card title="Need Help?" className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600">
              Having issues with your subscription? Our support team is here to help.
            </p>
          </div>
          <Button type="primary" className="mt-4 md:mt-0">
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashBilling;