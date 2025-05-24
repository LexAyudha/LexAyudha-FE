import React, { useState } from 'react';
import { Card, Progress, Row, Col, Badge, Button, Tooltip, Modal } from 'antd';
import { 
  TrophyOutlined, 
  StarOutlined, 
  FireOutlined,
  ClockCircleOutlined,
  LockOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const DashAchievements = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data - replace with actual data from your backend
  const achievements = {
    unlocked: [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first activity",
        icon: "🏆",
        date: "2024-05-01",
        progress: 100,
        category: "beginner"
      },
      {
        id: 2,
        title: "Consistent Learner",
        description: "Complete activities for 7 consecutive days",
        icon: "🔥",
        date: "2024-05-10",
        progress: 100,
        category: "consistency"
      },
      {
        id: 3,
        title: "Math Master",
        description: "Score 100% in 5 number recognition activities",
        icon: "⭐",
        date: "2024-05-15",
        progress: 100,
        category: "mastery"
      }
    ],
    locked: [
      {
        id: 4,
        title: "Perfect Week",
        description: "Complete all daily activities for a week",
        icon: "🌟",
        progress: 60,
        category: "consistency"
      },
      {
        id: 5,
        title: "Speed Demon",
        description: "Complete 10 activities in under 5 minutes each",
        icon: "⚡",
        progress: 30,
        category: "speed"
      },
      {
        id: 6,
        title: "Master of Numbers",
        description: "Master all number recognition activities",
        icon: "🎯",
        progress: 45,
        category: "mastery"
      }
    ]
  };

  const stats = {
    totalAchievements: 20,
    unlocked: 3,
    inProgress: 3,
    locked: 14
  };

  const showAchievementDetails = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAchievement(null);
  };

  const AchievementCard = ({ achievement, isLocked }) => (
    <Card
      hoverable
      className={`mb-4 ${isLocked ? 'opacity-75' : ''}`}
      onClick={() => showAchievementDetails(achievement)}
    >
      <div className="flex items-start">
        <div className="text-4xl mr-4">{achievement.icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
            {isLocked ? (
              <LockOutlined className="text-gray-400" />
            ) : (
              <CheckCircleOutlined className="text-green-500" />
            )}
          </div>
          <p className="text-gray-600 mb-2">{achievement.description}</p>
          <Progress 
            percent={achievement.progress} 
            size="small"
            status={isLocked ? "active" : "success"}
          />
          {achievement.date && (
            <p className="text-gray-500 text-sm mt-2">
              Unlocked on {achievement.date}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <Button type="primary" icon={<TrophyOutlined />}>
          View All Achievements
        </Button>
      </div>

      {/* Achievement Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
              <h3 className="text-lg font-semibold">Unlocked</h3>
              <p className="text-2xl font-bold">{stats.unlocked}</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <ClockCircleOutlined className="text-4xl text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold">In Progress</h3>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <LockOutlined className="text-4xl text-gray-500 mb-2" />
              <h3 className="text-lg font-semibold">Locked</h3>
              <p className="text-2xl font-bold">{stats.locked}</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Unlocked Achievements */}
      <Card title="Unlocked Achievements" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.unlocked.map(achievement => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              isLocked={false}
            />
          ))}
        </div>
      </Card>

      {/* Locked Achievements */}
      <Card title="Achievements in Progress" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.locked.map(achievement => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              isLocked={true}
            />
          ))}
        </div>
      </Card>

      {/* Achievement Details Modal */}
      <Modal
        title={selectedAchievement?.title}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedAchievement && (
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
            <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
            <Progress 
              percent={selectedAchievement.progress} 
              size="large"
              status={selectedAchievement.date ? "success" : "active"}
            />
            {selectedAchievement.date && (
              <p className="text-gray-500 mt-4">
                Unlocked on {selectedAchievement.date}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashAchievements;