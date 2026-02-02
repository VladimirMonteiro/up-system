import { Card, Row, Col, Typography, Space, Tag, Divider } from 'antd';
import {
  ToolOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { formateNumber } from '../../../../utils/formatNumber';

const { Text, Title } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case 'Disponível':
      return (
        <Tag icon={<CheckCircleOutlined />} color='success'>
          Disponível
        </Tag>
      );
    case 'Sem stock':
      return (
        <Tag icon={<StopOutlined />} color='error'>
          Sem estoque
        </Tag>
      );
    case 'Em manutenção':
      return (
        <Tag icon={<SettingOutlined />} color='warning'>
          Em manutenção
        </Tag>
      );
    default:
      return <Tag>—</Tag>;
  }
};

export function ToolInformations({ tool }) {
  return (
    <Card
      bordered={false}
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
      }}
      title={
        <Space>
          <ToolOutlined />
          <Title level={5} style={{ margin: 0 }}>
            Informações da Ferramenta
          </Title>
        </Space>
      }
    >
      {/* INFO BÁSICA */}
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Text type='secondary'>ID</Text>
          <div>
            <Text strong>#{tool.id}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Nome</Text>
          <div>
            <Text strong>{tool.name}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Categoria</Text>
          <div>
            <Text strong>{tool.category}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Status Atual</Text>
          <div style={{ marginTop: 4 }}>{getStatusTag(tool.status)}</div>
        </Col>
      </Row>

      <Divider />

      {/* QUANTIDADES */}
      <Title level={5}>Estoque</Title>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size='small' bordered={false} style={{ background: '#fafafa' }}>
            <Text type='secondary'>Quantidade Total</Text>
            <Title level={4} style={{ margin: 0 }}>
              {tool.totalQuantity}
            </Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card size='small' bordered={false} style={{ background: '#f6ffed' }}>
            <Text type='secondary'>Disponível</Text>
            <Title level={4} style={{ margin: 0 }}>
              {tool.quantityAvailable}
            </Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card size='small' bordered={false} style={{ background: '#fffbe6' }}>
            <Text type='secondary'>Em manutenção</Text>
            <Title level={4} style={{ margin: 0 }}>
              {tool.quantityMaintenance}
            </Title>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* VALORES */}
      <Title level={5}>Valores de Locação</Title>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text type='secondary'>Diária</Text>
          <div>
            <Text strong>{formateNumber(tool.daily)}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Semanal</Text>
          <div>
            <Text strong>{formateNumber(tool.week)}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Quinzenal</Text>
          <div>
            <Text strong>{formateNumber(tool.biweekly)}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>21 Dias</Text>
          <div>
            <Text strong>{formateNumber(tool.twentyOneDays)}</Text>
          </div>
        </Col>

        <Col span={8}>
          <Text type='secondary'>Mensal</Text>
          <div>
            <Text strong>{formateNumber(tool.priceMonth)}</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
