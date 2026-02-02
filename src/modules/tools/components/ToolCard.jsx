import { Card, Row, Col, Tag, Typography, Dropdown, Button, Divider, Skeleton } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formateNumber } from '../../../utils/formatNumber';

const { Text } = Typography;

/* =========================
   STATUS STYLE
========================= */
const statusStyle = (status) => {
  switch (status) {
    case 'Disponível':
      return { color: '#00b96b', bg: '#f6ffed' };
    case 'Em manutenção':
      return { color: '#faad14', bg: '#fff7e6' };
    case 'Indisponível':
      return { color: '#ff4d4f', bg: '#fff1f0' };
    default:
      return { color: '#8c8c8c', bg: '#f5f5f5' };
  }
};

export function ToolCard({ tools = [], loading, onEdit, onDelete }) {
  const navigate = useNavigate();

  /* =========================
     LOADING SKELETON
  ========================= */
  if (loading) {
    return (
      <Row gutter={[20, 20]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card style={{ borderRadius: 16 }}>
              <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */
  if (!loading && tools.length === 0) {
    return (
      <Row style={{ marginTop: 48, textAlign: 'center' }}>
        <Text type='secondary' style={{ margin: '0 auto' }}>
          Nenhuma ferramenta encontrada
        </Text>
      </Row>
    );
  }

  return (
    <Row gutter={[20, 20]}>
      {tools.map((tool) => {
        const status = tool.quantityAvailable === 0 ? 'Indisponível' : tool.status;

        const style = statusStyle(status);

        return (
          <Col xs={24} md={12} lg={8} key={tool.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              extra={
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'details',
                        label: 'Ver detalhes',
                        icon: <AppstoreOutlined />,
                        onClick: () => navigate(`/ferramentas/${tool.id}`),
                      },
                      {
                        key: 'edit',
                        label: 'Editar',
                        icon: <EditOutlined />,
                        onClick: () => onEdit(tool),
                      },
                      {
                        key: 'delete',
                        label: 'Excluir',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => onDelete(tool.id),
                      },
                    ],
                  }}
                >
                  <Button type='text' icon={<MoreOutlined />} style={{ color: '#8c8c8c' }} />
                </Dropdown>
              }
            >
              {/* HEADER */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #1677ff, #69b1ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                  }}
                >
                  <AppstoreOutlined />
                </div>

                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 15 }}>
                    {tool.name}
                  </Text>
                  <br />
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    {tool.category}
                  </Text>
                </div>
              </div>

              {/* STATUS */}
              <Tag
                style={{
                  marginTop: 14,
                  padding: '4px 12px',
                  fontWeight: 500,
                  fontSize: 12,
                  color: style.color,
                  background: style.bg,
                  border: `1px solid ${style.color}20`,
                  borderRadius: 999,
                  width: 'fit-content',
                }}
              >
                {status}
              </Tag>

              <Divider style={{ margin: '14px 0' }} />

              {/* QUANTIDADES */}
              <Row gutter={8}>
                {[
                  { label: 'Total', value: tool.totalQuantity },
                  { label: 'Disponível', value: tool.quantityAvailable },
                  { label: 'Manutenção', value: tool.quantityMaintenance },
                ].map((item) => (
                  <Col span={8} key={item.label}>
                    <div
                      style={{
                        background: '#fafafa',
                        borderRadius: 10,
                        padding: '8px 0',
                        textAlign: 'center',
                      }}
                    >
                      <Text type='secondary' style={{ fontSize: 11 }}>
                        {item.label}
                      </Text>
                      <br />
                      <Text strong style={{ fontSize: 15 }}>
                        {item.value}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>

              <Divider style={{ margin: '14px 0' }} />

              {/* PREÇOS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {[
                  ['Diária', tool.daily],
                  ['Semanal', tool.week],
                  ['15 dias', tool.biweekly],
                  ['21 dias', tool.twentyOneDays],
                  ['Mensal', tool.priceMonth],
                ].map(([label, value]) => (
                  <div key={label}>
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {label}
                    </Text>
                    <br />
                    <Text strong>{formateNumber(value)}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
