import { Typography, Space, Divider } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

const { Text } = Typography;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: '32px 24px',
        textAlign: 'center',
        marginTop: 'auto', // Empurra para o fim da página
      }}
    >
      {/* Linha sutil para separar do conteúdo */}
      <Divider style={{ marginBottom: '24px', opacity: 0.6 }} />

      <Space direction='vertical' size={2} style={{ width: '100%' }}>
        <Space
          split={<Divider type='vertical' style={{ borderColor: '#d1d5db' }} />}
          style={{ marginBottom: '4px' }}
        >
          <Text
            strong
            style={{
              letterSpacing: '1px',
              fontSize: '12px',
              color: '#1e293b',
              textTransform: 'uppercase',
            }}
          >
            Outer <span style={{ color: '#1890ff' }}>Code</span>
          </Text>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            Software Solutions
          </Text>
        </Space>

        <Text style={{ fontSize: '11px', color: '#94a3b8' }}>
          &copy; {currentYear} • Desenvolvido com precisão por <strong>Outer Code</strong>
        </Text>
      </Space>
    </footer>
  );
}
