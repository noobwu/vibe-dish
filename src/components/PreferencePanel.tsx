import React from 'react';
import { Card, Row, Col, Radio, Slider, Button, Space, Typography, Divider } from 'antd';
import { ThunderboltOutlined, ExperimentOutlined } from '@ant-design/icons';
import { UserPreferences } from '../types';
import './PreferencePanel.css';

const { Title, Text } = Typography;

interface PreferencePanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onGenerate: () => void;
  onRandom: () => void;
  loading: boolean;
}

const PreferencePanel: React.FC<PreferencePanelProps> = ({
  preferences,
  onPreferencesChange,
  onGenerate,
  onRandom,
  loading
}) => {
  const handleGenderChange = (e: any) => {
    onPreferencesChange({ ...preferences, gender: e.target.value });
  };

  const handleAgeChange = (value: number) => {
    onPreferencesChange({ ...preferences, age: value });
  };

  const handleTasteChange = (e: any) => {
    onPreferencesChange({ ...preferences, taste: e.target.value });
  };

  const handleBudgetChange = (values: [number, number]) => {
    onPreferencesChange({ ...preferences, budgetMin: values[0], budgetMax: values[1] });
  };

  return (
    <Card className="preference-panel" bordered={false}>
      <div className="panel-header">
        <Title level={4} className="panel-title">
          ✨ 选择你的偏好
        </Title>
        <Text className="panel-subtitle">
          根据你的喜好生成个性化推荐
        </Text>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <div className="preference-item">
            <Text className="preference-label">性别</Text>
            <Radio.Group
              value={preferences.gender}
              onChange={handleGenderChange}
              className="preference-radio"
              buttonStyle="solid"
            >
              <Radio.Button value="male">👨 男</Radio.Button>
              <Radio.Button value="female">👩 女</Radio.Button>
            </Radio.Group>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="preference-item">
            <Text className="preference-label">年龄: {preferences.age}岁</Text>
            <Slider
              min={18}
              max={80}
              value={preferences.age}
              onChange={handleAgeChange}
              className="preference-slider"
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="preference-item">
            <Text className="preference-label">口味偏好</Text>
            <Radio.Group
              value={preferences.taste}
              onChange={handleTasteChange}
              className="preference-radio"
              buttonStyle="solid"
            >
              <Radio.Button value="spicy">🌶️ 辣</Radio.Button>
              <Radio.Button value="light">🥬 清淡</Radio.Button>
              <Radio.Button value="sweet">🍯 酸甜</Radio.Button>
              <Radio.Button value="random">🎲 随机</Radio.Button>
            </Radio.Group>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="preference-item">
            <Text className="preference-label">
              预算范围: ¥{preferences.budgetMin} - ¥{preferences.budgetMax}
            </Text>
            <Slider
              range
              min={5}
              max={100}
              value={[preferences.budgetMin, preferences.budgetMax]}
              onChange={handleBudgetChange}
              className="preference-slider"
              marks={{
                5: '¥5',
                25: '¥25',
                50: '¥50',
                75: '¥75',
                100: '¥100'
              }}
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <Space size="large" className="action-buttons">
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={onGenerate}
          loading={loading}
          className="generate-button"
        >
          生成推荐
        </Button>
        <Button
          size="large"
          icon={<ExperimentOutlined />}
          onClick={onRandom}
          className="random-button"
        >
          随便试试
        </Button>
      </Space>
    </Card>
  );
};

export default PreferencePanel;
