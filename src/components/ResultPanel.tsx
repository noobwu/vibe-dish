import React from 'react';
import { Card, Row, Col, Tag, Typography, Empty } from 'antd';
import { EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Recommendation, Dish } from '../types';
import './ResultPanel.css';

const { Title, Text } = Typography;

interface ResultPanelProps {
  recommendations: Recommendation[];
  dishes: Dish[];
}

const ResultPanel: React.FC<ResultPanelProps> = ({ recommendations, dishes }) => {
  const findDishByName = (name: string): Dish | undefined => {
    return dishes.find(d => d.name === name);
  };

  const handleDishClick = (dishName: string) => {
    const dish = findDishByName(dishName);
    if (dish && dish.restaurant) {
      alert(`即将跳转到 ${dish.restaurant} 的点餐页面\n\n菜品: ${dish.name}\n价格: ¥${dish.price}`);
    } else {
      alert(`即将跳转到点餐页面\n\n菜品: ${dishName}`);
    }
  };

  return (
    <Card className="result-panel" bordered={false}>
      <div className="panel-header">
        <Title level={4} className="panel-title">
          🎯 为你推荐
        </Title>
        <Text className="panel-subtitle">
          找到了 {recommendations.length} 道符合你口味的菜品
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {recommendations.map((rec, index) => {
          const dish = findDishByName(rec.dishName);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                className="dish-card"
                onClick={() => handleDishClick(rec.dishName)}
                cover={
                  dish && dish.image ? (
                    <div className="dish-image-container">
                      <img alt={rec.dishName} src={dish.image} className="dish-image" />
                      <div className="dish-overlay">
                        <CheckCircleOutlined className="check-icon" />
                      </div>
                    </div>
                  ) : (
                    <div className="dish-placeholder">
                      <span className="placeholder-text">{rec.dishName[0]}</span>
                    </div>
                  )
                }
              >
                <div className="dish-content">
                  <Title level={5} className="dish-name" ellipsis={{ rows: 1 }}>
                    {rec.dishName}
                  </Title>
                  
                  {dish && (
                    <Text type="secondary" className="dish-price">
                      ¥{dish.price}
                    </Text>
                  )}

                  <div className="dish-tags">
                    {dish && dish.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Tag key={tagIndex} color={tag === '辣' ? 'red' : tag === '清淡' ? 'green' : tag === '酸甜' ? 'orange' : 'default'}>
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  <Text type="secondary" className="dish-reason">
                    💡 {rec.feature}
                  </Text>

                  {dish && dish.restaurant && (
                    <div className="dish-restaurant">
                      <EnvironmentOutlined />
                      <Text type="secondary" className="restaurant-name">
                        {dish.restaurant}
                      </Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default ResultPanel;
