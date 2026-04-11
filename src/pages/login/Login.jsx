import { useContext, useState } from 'react';
import { authContext } from '../../context/authProvider/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Badge, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import logo from '../../assets/logo_up.png';
import outerCodeLogo from '../../assets/outer-code-logo.png'  // Caminho da imagem que você enviou
import styles from './Login.module.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const auth = useContext(authContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await auth.authenticate(values);
      if (data.status === 403) {
        setErrorMsg('Credenciais não autorizadas.');
      } else if (data.response) {
        setErrorMsg(data.response.data.errors?.[0] || 'Falha na autenticação.');
      } else {
        navigate('/inicial');
      }
    } catch (err) {
      setErrorMsg('Erro de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.brandSide}>
        <div className={styles.brandOverlay} />
        <div className={styles.brandContent}>
          {/* Logo UP em destaque máximo */}
          <img src={logo} alt="Up Locações" className={styles.mainLogoLarge} />
          
          <div className={styles.badgeArea}>
            <Badge status="processing" color="#52c41a" text={<span style={{color: '#fff'}}>Sistema Operacional Ativo</span>} />
          </div>

          <Title level={1} className={styles.mainTitle}>
            Gestão de  
            <span> Locações</span>
          </Title>
          
          <div className={styles.clientInfo}>
            <Text className={styles.clientText}>
              Ambiente exclusivo para colaboradores e parceiros da <strong>Up Locações</strong>.
            </Text>
          </div>
        </div>
        
        <div className={styles.brandFooter}>
          <Text className={styles.footerDraft}>PLATAFORMA CORPORATIVA v2.0.0</Text>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.loginBox}>
          <header className={styles.loginHeader}>
            <Title level={3}>Login Administrativo</Title>
            <Text type="secondary">Insira suas credenciais para continuar</Text>
          </header>

          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon closable className={styles.alert} />
          )}

          <Form layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
            <Form.Item
              name="login"
              label={<Text strong className={styles.label}>NOME DE USUÁRIO</Text>}
              rules={[{ required: true, message: 'O usuário é obrigatório' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ex: admin.up" className={styles.customInput} />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text strong className={styles.label}>SENHA DE ACESSO</Text>}
              rules={[{ required: true, message: 'A senha é obrigatória' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" className={styles.customInput} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading} className={styles.submitBtn}>
              ENTRAR NO SISTEMA
            </Button>
          </Form>

          {/* Assinatura Outer Code com a Foto enviada */}
          <footer className={styles.devFooter}>
            <div className={styles.devBrand}>
              <Avatar 
                src={outerCodeLogo} 
                size={45} 
                shape="square"
                className={styles.devAvatar}
              />
              <div className={styles.devTextContainer}>
                <Text className={styles.devLabel}>PROJETADO E DESENVOLVIDO POR</Text>
                <Title level={5} className={styles.devName}>
                  OUTER <span style={{ color: '#1890ff' }}>CODE</span>
                </Title>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;