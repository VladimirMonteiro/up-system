import {
  DollarOutlined,
  LineChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Card, Row, Col, Typography } from 'antd';
import { formateNumber } from '../../../../../utils/formatNumber';

const { Text } = Typography;

type KpiCards = {
  daily: number;
  totalRevenue: number;
  quantityTotalRent: number;
  quantityRentActive: number;
};

export function KpiCards({ tool }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {[
        {
          title: 'Valor Diária',
          value: `${formateNumber(tool.daily)}`,
          icon: <DollarOutlined />,
          color: '#1677ff',
        },
        {
          title: 'Receita Total',
          value: `R$ ${tool.totalRevenue || 0}`,
          icon: <LineChartOutlined />,
          color: '#52c41a',
        },
        {
          title: 'Total de Locações',
          value: tool.quantityTotalRent || 0,
          icon: <CalendarOutlined />,
          color: '#8c8c8c',
        },
        {
          title: 'Qtn em locações ativas',
          value: tool.quantityRentActive || 0,
          icon: <ClockCircleOutlined />,
          color: '#1677ff',
        },
      ].map((item, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card styles={{ body: { padding: '20px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  background: `${item.color}15`,
                  padding: '12px',
                  borderRadius: '8px',
                  color: item.color,
                  fontSize: '20px',
                  display: 'flex',
                }}
              >
                {item.icon}
              </div>
              <div>
                <Text type='secondary' style={{ fontSize: '12px', display: 'block' }}>
                  {item.title}
                </Text>
                <Text strong style={{ fontSize: '20px' }}>
                  {item.value}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
