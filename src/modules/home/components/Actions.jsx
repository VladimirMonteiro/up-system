import { Col, Card, Button, Skeleton } from 'antd';
import { PlusOutlined, UserAddOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export function Actions({ loading }) {
  const navigate = useNavigate();

  return (
    <Col xs={24} md={8}>
      <Card title='Ações Rápidas' style={{ borderRadius: 12 }}>
        <Skeleton loading={loading} active>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            block
            size='large'
            style={{ marginBottom: 12 }}
            onClick={() => navigate('/alugar')}
          >
            Novo Aluguel
          </Button>
          <Button
            icon={<UserAddOutlined />}
            block
            size='large'
            style={{ marginBottom: 12 }}
            onClick={() => navigate('/clientes')}
          >
            Novo Cliente
          </Button>
          <Button
            icon={<FileAddOutlined />}
            block
            size='large '
            onClick={() => navigate('/criar-orcamento')}
          >
            Novo orçamento
          </Button>
        </Skeleton>
      </Card>
    </Col>
  );
}
