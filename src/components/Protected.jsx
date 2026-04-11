import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { authContext } from '../context/authProvider/AuthContext';

const Protected = () => {
  const { token, loading } = useContext(authContext);

  // Loading elegante
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

  // Não autenticado
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

  // Autenticado → libera as rotas filhas
  return <Outlet />;
};

export default Protected;
