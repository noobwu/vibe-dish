import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Header from './components/Header';
import PreferencePanel from './components/PreferencePanel';
import ResultPanel from './components/ResultPanel';
import SettingsModal from './components/SettingsModal';
import { mockDishes, mockOrderHistory } from './data/mockData';
import { UserPreferences, ApiConfig, Recommendation, Dish } from './types';
import { generateRecommendations } from './services/llmService';
import './App.css';

const { Content } = Layout;

const defaultApiConfig: ApiConfig = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  apiKey: '',
  model: 'Qwen/Qwen3-8B'
};

const defaultPreferences: UserPreferences = {
  gender: 'male',
  age: 25,
  taste: 'random',
  budgetMin: 5,
  budgetMax: 50
};

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(defaultApiConfig);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orderHistory] = useState(mockOrderHistory);

  useEffect(() => {
    const savedApiConfig = localStorage.getItem('apiConfig');
    if (savedApiConfig) {
      setApiConfig(JSON.parse(savedApiConfig));
    }

    setDishes(mockDishes);
  }, []);

  const handleGenerateRecommendations = async () => {
    if (!apiConfig.apiKey) {
      messageApi.warning('请先配置API密钥');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    try {
      const results = await generateRecommendations(apiConfig, preferences, dishes, orderHistory);
      setRecommendations(results);
      messageApi.success('推荐生成成功！');
    } catch (error) {
      messageApi.error('生成推荐失败，请检查API配置');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomRecommendations = () => {
    const filteredDishes = dishes.filter(
      dish => dish.price >= preferences.budgetMin && dish.price <= preferences.budgetMax
    );
    const shuffled = [...filteredDishes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);

    const randomRecommendations: Recommendation[] = selected.map(dish => ({
      dishName: dish.name,
      feature: dish.tags.join(', ')
    }));

    setRecommendations(randomRecommendations);
    messageApi.success('随机推荐已生成！');
  };

  const handleSaveSettings = (config: ApiConfig) => {
    setApiConfig(config);
    localStorage.setItem('apiConfig', JSON.stringify(config));
    setShowSettings(false);
    messageApi.success('API配置已保存');
  };

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#ff6b6b',
          borderRadius: 8,
        },
      }}
    >
      {contextHolder}
      <Layout className="app-layout">
        <Header onSettingsClick={() => setShowSettings(true)} />

        <Content className="app-content">
          <PreferencePanel
            preferences={preferences}
            onPreferencesChange={setPreferences}
            onGenerate={handleGenerateRecommendations}
            onRandom={handleRandomRecommendations}
            loading={loading}
          />

          {recommendations.length > 0 && (
            <ResultPanel
              recommendations={recommendations}
              dishes={dishes}
            />
          )}
        </Content>

        <SettingsModal
          visible={showSettings}
          apiConfig={apiConfig}
          onSave={handleSaveSettings}
          onCancel={() => setShowSettings(false)}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default App;
