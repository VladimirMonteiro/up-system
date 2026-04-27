import { Outlet } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../hooks/useAuth';

const Protected = () => {
  const { user, loading } = useAuth();

  const token = user?.token;

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (!token) {
    return (
      <Result
        status='403'
        title='403'
        subTitle='Você não tem permissão para acessar esta página.'
        extra={
          <Button type='primary' onClick={() => (window.location.href = '/')}>
            Ir para o login
          </Button>
        }
      />
    );
  }

  return <Outlet />;
};

export default Protected;
