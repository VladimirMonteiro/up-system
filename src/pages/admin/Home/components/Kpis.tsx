import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import { RiseOutlined, ToolOutlined, DollarOutlined } from '@ant-design/icons';
import { DashboardHomeResponse } from '../../../../services/homeService/types';

type KpiProps = {
  data: DashboardHomeResponse | null;
  loading: boolean;
};

export function Kpis({ data, loading }: KpiProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            {data && (
              <Statistic
                title='Total de clientes'
                value={data?.totalClients ?? 0}
                prefix={<RiseOutlined />}
              />
            )}
          </Skeleton>
        </Card>
      </Col>

      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            {data && (
              <Statistic
                title='Ferramentas Disponíveis'
                value={data?.availableTools ?? 0}
                prefix={<ToolOutlined />}
              />
            )}
          </Skeleton>
        </Card>
      </Col>

      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            {data && (
              <Statistic
                title='Ferramentas Alugadas'
                value={data?.rentedTools ?? 0}
                prefix={<ToolOutlined />}
              />
            )}
          </Skeleton>
        </Card>
      </Col>

      <Col xs={24} md={6}>
        <Card style={{ borderRadius: 12 }}>
          <Skeleton loading={loading} active>
            {data && (
              <Statistic
                title='Faturamento do Mês'
                value={data?.monthlyRevenue ?? 0}
                precision={2}
                prefix={<DollarOutlined />}
              />
            )}
          </Skeleton>
        </Card>
      </Col>
    </Row>
  );
}
