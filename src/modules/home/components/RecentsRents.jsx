import { Col, Card, Button, List, Tag, Skeleton } from 'antd';
import { formateNumber } from '../../../utils/formatNumber';

import { useNavigate } from 'react-router-dom';

export function RecentRents({ data, loading }) {
  const navigate = useNavigate();

  return (
    <Col xs={24} md={14}>
      <Card>
        <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Aluguéis Recentes
              </h3>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>Últimas locações realizadas</span>
            </div>

            <Button type='link' onClick={() => navigate('/alugueis')}>
              Ver todos
            </Button>
          </div>
          <List
            dataSource={data.recentRents}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={`${item.id} - ${item.clientName}`}
                  description={item.items.map((item) => item.name + ' | ')}
                />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>{formateNumber(item.price)}</div>
                  <div style={{ margin: '3px 0' }}>{item.createdAt}</div>
                  <Tag
                    color={
                      item.stateRent === 'Entregue'
                        ? 'green'
                        : item.stateRent === 'Pendente'
                          ? 'gold'
                          : 'default'
                    }
                  >
                    {item.stateRent}
                  </Tag>

                  <Tag
                    color={
                      item.paymentStatus === 'Pago'
                        ? 'green'
                        : item.paymentStatus === 'Parc pago'
                          ? 'orange'
                          : 'red'
                    }
                  >
                    {item.paymentStatus}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Skeleton>
      </Card>
    </Col>
  );
}
