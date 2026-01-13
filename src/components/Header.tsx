import React from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC<{ onSettingsClick: () => void }> = ({ onSettingsClick }) => {
  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <Space direction="vertical" size={0}>
          <Title level={3} className="app-title">
            🍜 点餐灵感生成器
          </Title>
          <Text className="app-subtitle">
            30秒找到符合口味和预算的新选择
          </Text>
        </Space>
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={onSettingsClick}
          className="settings-button"
        >
          设置
        </Button>
      </div>
    </AntHeader>
  );
};

export default Header;
