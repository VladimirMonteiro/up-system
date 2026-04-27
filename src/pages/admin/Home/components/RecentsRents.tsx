import { Col, Card, Button, List, Tag, Skeleton } from 'antd';
import { formateNumber } from '../../../../utils/formatNumber';
import { useNavigate } from 'react-router-dom';
import { DashboardHomeResponse } from '../../../../services/homeService/types';

type RecentRentsProps = {
  data: DashboardHomeResponse | null;
  loading: boolean;
};

export function RecentRents({ data, loading }: RecentRentsProps) {
  const navigate = useNavigate();

  return (
    <Col xs={24} md={14}>
      <Card>
        <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
          {data && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Aluguéis Recentes</h3>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                    Últimas locações realizadas
                  </span>
                </div>

                <Button type='link' onClick={() => navigate('/alugueis')}>
                  Ver todos
                </Button>
              </div>

              <List
                dataSource={data.recentRents}
                renderItem={(rent) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${rent.id} - ${rent.clientName}`}
                      description={rent.items.map((i) => i.name).join(' | ')}
                    />

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600 }}>{formateNumber(rent.price)}</div>

                      <div style={{ margin: '3px 0' }}>{rent.createdAt}</div>

                      <Tag
                        color={
                          rent.stateRent === 'Entregue'
                            ? 'green'
                            : rent.stateRent === 'Pendente'
                              ? 'gold'
                              : 'default'
                        }
                      >
                        {rent.stateRent}
                      </Tag>

                      <Tag
                        color={
                          rent.paymentStatus === 'Pago'
                            ? 'green'
                            : rent.paymentStatus === 'Parc pago'
                              ? 'orange'
                              : 'red'
                        }
                      >
                        {rent.paymentStatus}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
        </Skeleton>
      </Card>
    </Col>
  );
}
