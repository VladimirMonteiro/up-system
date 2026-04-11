import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import { RiseOutlined, ToolOutlined, DollarOutlined } from '@ant-design/icons';

export function Kpis({ data, loading }) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            <Statistic title='Total de clientes' value={data.totalClients} prefix={<RiseOutlined />} />
          </Skeleton>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            <Statistic
              title='Ferramentas Disponíveis'
              value={data.availableTools}
              prefix={<ToolOutlined />}
            />
          </Skeleton>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            <Statistic
              title='Ferramentas Alugadas'
              value={data.rentedTools}
              prefix={<ToolOutlined />}
            />
          </Skeleton>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            <Statistic
              title='Faturamento do Mês'
              value={data.monthlyRevenue}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Skeleton>
        </Card>
      </Col>
    </Row>
  );
}
