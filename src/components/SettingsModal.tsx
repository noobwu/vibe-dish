import React from 'react';
import { Modal, Form, Input, Typography, Space, Divider, Alert } from 'antd';
import { KeyOutlined, LinkOutlined, RobotOutlined } from '@ant-design/icons';
import { ApiConfig } from '../types';
import './SettingsModal.css';

const { Title, Text } = Typography;

interface SettingsModalProps {
  visible: boolean;
  apiConfig: ApiConfig;
  onSave: (config: ApiConfig) => void;
  onCancel: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  apiConfig,
  onSave,
  onCancel
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then(values => {
      onSave({
        apiUrl: values.apiUrl,
        apiKey: values.apiKey,
        model: values.model
      });
    });
  };

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined />
          <span>API 配置</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="保存配置"
      cancelText="取消"
      width={600}
      className="settings-modal"
    >
      <Alert
        message="配置说明"
        description="请填写 SiliconFlow API 的配置信息。API 密钥仅保存在本地浏览器中，不会上传到服务器。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          apiUrl: apiConfig.apiUrl,
          apiKey: apiConfig.apiKey,
          model: apiConfig.model
        }}
      >
        <Form.Item
          label={
            <Space>
              <LinkOutlined />
              <span>API 地址</span>
            </Space>
          }
          name="apiUrl"
          rules={[
            { required: true, message: '请输入API地址' },
            { type: 'url', message: '请输入有效的URL地址' }
          ]}
        >
          <Input placeholder="https://api.siliconflow.cn/v1/chat/completions" />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <KeyOutlined />
              <span>API 密钥</span>
            </Space>
          }
          name="apiKey"
          rules={[{ required: true, message: '请输入API密钥' }]}
        >
          <Input.Password placeholder="请输入您的API密钥" />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <RobotOutlined />
              <span>模型名称</span>
            </Space>
          }
          name="model"
          rules={[{ required: true, message: '请输入模型名称' }]}
        >
          <Input placeholder="Qwen/Qwen3-8B" />
        </Form.Item>

        <Divider />

        <div className="help-section">
          <Title level={5}>如何获取 API 密钥？</Title>
          <ol className="help-list">
            <li>访问 <Text code>SiliconFlow</Text> 官网</li>
            <li>注册并登录账号</li>
            <li>在控制台中创建 API 密钥</li>
            <li>将密钥复制到上方输入框中</li>
          </ol>
        </div>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
