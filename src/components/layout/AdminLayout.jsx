import styles from './styles.module.css';
import { Outlet } from 'react-router-dom';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { authContext } from '../../context/authProvider/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import Navbar from '../navbar/Navbar.jsx';

const { Header, Content, Sider } = Layout;

export default function AdminLayout() {
  const { logout } = useContext(authContext);
  const nagivate = useNavigate();

  const userMenu = {
    onClick: ({ key }) => {
      if (key === 'logout') {
        logout();
        nagivate('/');
      }
    },
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sair',
      },
    ],
  };

  return (
    <Layout className={styles.layout}>
      {/* Sidebar */}
      <Sider width={260} className={styles.sider}>
        <Navbar />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className={styles.header}>
          <div className={styles.headerRight}>
            <Dropdown menu={userMenu} placement='bottomRight'>
              <Space className={styles.user}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.username}>Admin</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
