import { Card, Row, Col, Tag, Typography, Dropdown, Button, Divider, Skeleton } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ToolResponse } from '../../../../services/toolService/types';
import { formateNumber } from '../../../../utils/formatNumber';

const { Text } = Typography;

/* =========================
   STATUS (UI)
========================= */
type ToolStatusLabel = 'Disponível' | 'Em manutenção' | 'Indisponível';

type StatusStyle = {
  color: string;
  bg: string;
};

/* =========================
   MAP BACKEND → UI
========================= */
const mapStatus = (tool: ToolResponse): ToolStatusLabel => {
  if (tool.quantityAvailable === 0) return 'Indisponível';

  switch (tool.status) {
    case 'AVAILABLE':
      return 'Disponível';
    case 'MAINTENANCE':
      return 'Em manutenção';
    default:
      return 'Indisponível';
  }
};

/* =========================
   STYLE
========================= */
const statusStyle = (status: ToolStatusLabel): StatusStyle => {
  switch (status) {
    case 'Disponível':
      return { color: '#00b96b', bg: '#f6ffed' };
    case 'Em manutenção':
      return { color: '#faad14', bg: '#fff7e6' };
    case 'Indisponível':
      return { color: '#ff4d4f', bg: '#fff1f0' };
  }
};

/* =========================
   PROPS
========================= */
type ToolCardProps = {
  tools?: ToolResponse[];
  loading?: boolean;
  onEdit: (tool: ToolResponse) => void;
  onDelete: (id: ToolResponse['id']) => void;
};

export function ToolCard({ tools = [], loading = false, onEdit, onDelete }: ToolCardProps) {
  const navigate = useNavigate();

  /* =========================
     LOADING
  ========================== */
  if (loading) {
    return (
      <Row gutter={[20, 20]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card style={cardStyle}>
              <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  /* =========================
     EMPTY
  ========================== */
  if (tools.length === 0) {
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
        const statusLabel = mapStatus(tool);
        const style = statusStyle(statusLabel);

        const quantities = [
          { label: 'Total', value: tool.totalQuantity },
          { label: 'Disponível', value: tool.quantityAvailable },
          { label: 'Manutenção', value: tool.quantityMaintenance },
        ];

        const prices = [
          { label: 'Diária', value: tool.daily },
          { label: 'Semanal', value: tool.week },
          { label: '15 dias', value: tool.biweekly },
          { label: '21 dias', value: tool.twentyOneDays },
          { label: 'Mensal', value: tool.priceMonth },
        ];

        return (
          <Col xs={24} md={12} lg={8} key={tool.id}>
            <Card
              hoverable
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                e.currentTarget.style.transform = hoverStyle.transform;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
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
                <div style={iconStyle}>
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
              <Tag style={{ ...tagBaseStyle, color: style.color, background: style.bg }}>
                {statusLabel}
              </Tag>

              <Divider style={{ margin: '14px 0' }} />

              {/* QUANTIDADES */}
              <Row gutter={8}>
                {quantities.map((item) => (
                  <Col span={8} key={item.label}>
                    <div style={boxStyle}>
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
              <div style={priceGridStyle}>
                {prices.map((item) => (
                  <div key={item.label}>
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {item.label}
                    </Text>
                    <br />
                    <Text strong>{formateNumber(item.value)}</Text>
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

/* =========================
   STYLES (fora do componente)
========================= */

const cardStyle: React.CSSProperties = {
  borderRadius: 16,
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  transition: 'all 0.3s ease',
};

const hoverStyle = {
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  transform: 'translateY(-4px)',
};

const iconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #1677ff, #69b1ff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 20,
};

const tagBaseStyle: React.CSSProperties = {
  marginTop: 14,
  padding: '4px 12px',
  fontWeight: 500,
  fontSize: 12,
  borderRadius: 999,
  width: 'fit-content',
};

const boxStyle: React.CSSProperties = {
  background: '#fafafa',
  borderRadius: 10,
  padding: '8px 0',
  textAlign: 'center',
};

const priceGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};
