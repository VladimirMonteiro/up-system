import { ArrowLeftOutlined } from '@ant-design/icons';
import { Tag, Button, Typography } from 'antd';
import { Heading } from '../../../../components/Heading';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export function ToolDetailsHeader({ tool }) {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button
        type='text'
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)} // Volta para a página anterior
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heading title={tool.name} />
        </div>
        <Text type='secondary'>{tool.category}</Text>
      </div>
    </div>
  );
}
