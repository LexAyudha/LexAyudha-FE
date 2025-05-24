import React, { useState } from 'react';
import { 
  Card, 
  Switch, 
  Button, 
  Input, 
  Select, 
  Divider, 
  Form, 
  message,
  Modal,
  Tabs,
  Radio,
  Space,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  EyeOutlined,
  SoundOutlined,
  NotificationOutlined,
  SafetyOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const DashSettings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  // Mock user data - replace with actual data from your backend
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    language: "en",
    theme: "light",
    notifications: {
      email: true,
      push: true,
      weeklyReport: true,
      achievementAlerts: true
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      showAchievements: true
    },
    accessibility: {
      fontSize: "medium",
      highContrast: false,
      soundEffects: true
    }
  };

  const handleSaveSettings = async (values) => {
    setLoading(true);
    try {
      // API call to save settings would go here
      console.log('Saving settings:', values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      // API call to change password would go here
      console.log('Changing password:', values);
      message.success('Password changed successfully');
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button 
          type="primary" 
          icon={<SettingOutlined />}
          onClick={() => form.submit()}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={userData}
        onFinish={handleSaveSettings}
      >
        <Tabs defaultActiveKey="1">
          {/* Account Settings */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Account
              </span>
            }
            key="1"
          >
            <Card className="mb-6">
              <Form.Item
                name="name"
                label="Display Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your email" />
              </Form.Item>

              <Button 
                type="link" 
                onClick={() => setIsPasswordModalVisible(true)}
                icon={<LockOutlined />}
              >
                Change Password
              </Button>
            </Card>
          </TabPane>

          {/* Notifications */}
          <TabPane
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            }
            key="2"
          >
            <Card className="mb-6">
              <Form.Item
                name={['notifications', 'email']}
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={['notifications', 'push']}
                label="Push Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={['notifications', 'weeklyReport']}
                label="Weekly Progress Report"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={['notifications', 'achievementAlerts']}
                label="Achievement Alerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </TabPane>

          {/* Privacy */}
          <TabPane
            tab={
              <span>
                <SafetyOutlined />
                Privacy
              </span>
            }
            key="3"
          >
            <Card className="mb-6">
              <Form.Item
                name={['privacy', 'profileVisibility']}
                label="Profile Visibility"
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="public">Public</Radio>
                    <Radio value="private">Private</Radio>
                    <Radio value="friends">Friends Only</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name={['privacy', 'showProgress']}
                label="Show Progress to Others"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={['privacy', 'showAchievements']}
                label="Show Achievements to Others"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </TabPane>

          {/* Preferences */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Preferences
              </span>
            }
            key="4"
          >
            <Card className="mb-6">
              <Form.Item
                name="language"
                label="Language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="theme"
                label="Theme"
              >
                <Radio.Group>
                  <Radio.Button value="light">Light</Radio.Button>
                  <Radio.Button value="dark">Dark</Radio.Button>
                  <Radio.Button value="system">System</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Divider>Accessibility</Divider>

              <Form.Item
                name={['accessibility', 'fontSize']}
                label="Font Size"
              >
                <Radio.Group>
                  <Radio.Button value="small">Small</Radio.Button>
                  <Radio.Button value="medium">Medium</Radio.Button>
                  <Radio.Button value="large">Large</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name={['accessibility', 'highContrast']}
                label="High Contrast Mode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={['accessibility', 'soundEffects']}
                label="Sound Effects"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>
      </Form>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handlePasswordChange}>
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: 'Please input your current password!' }]}
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm New Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashSettings;