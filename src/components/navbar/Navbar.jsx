import React, { useState, useEffect, useContext } from "react";
import { Menu} from "antd";
import {
  ContainerOutlined,
  PieChartOutlined,
  ToolOutlined,
  UserOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css'
import logo_up from "../../assets/logo_up.png"
import {authContext} from '../../context/authProvider/AuthContext'

const MyMenu = () => {
  const location = useLocation(); // Hook para obter a localização atual da página
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const auth = useContext(authContext)
  const navigate = useNavigate()

  const handleLogout = () => {

      auth.logout()
      navigate("/")

  }

  // Lista de itens do menu
  const items = [
    {
      key: "0",
      icon: <PieChartOutlined />,
      label: <NavLink to="/inicial">Inicial</NavLink>,
    },
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: <NavLink to="/alugar">Alugar</NavLink>,
    },
    {
      key: "2",
      icon: <ToolOutlined />,
      label: <NavLink to="/ferramentas">Ferramentas</NavLink>,
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: <NavLink to="/clientes">Clientes</NavLink>,
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: <NavLink to="/alugueis">Alugueis</NavLink>,
    },
    {
      key: "sub1",
      label: "Financeiro",
      icon: <LineChartOutlined />,
      children: [
        {
          key: "5",
          label: <NavLink to="/faturamentos">Faturamentos</NavLink>,
        },
        {
          key: "6",
          label: <NavLink to="/gastos">Gastos</NavLink>,
        },
      ],
    },
  ];

  // Função para definir a chave selecionada com base na rota atual
  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/inicial":
        return "0";
      case "/alugar":
        return "1";
      case "/ferramentas":
        return "2";
      case "/clientes":
        return "3";
      case "/alugueis":
        return "4";
      case "/faturamentos":
        return "5";
      case "/gastos":
        return "6";
      default:
        return ""; // Se não houver correspondência, não seleciona nenhum
    }
  };

  // Função para lidar com clique no menu
  const handleClick = (e) => {
    // Aqui, você pode adicionar mais lógica se necessário
    console.log("Item clicado:", e);
  };

  // Função para controlar os submenus abertos
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // Atualizando a chave selecionada sempre que a localização mudar
  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location]);

  const [selectedKey, setSelectedKey] = useState(getSelectedKey()); // Definindo a chave selecionada inicialmente
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ width: "257px"}}>
     <div className={collapsed ?  styles.titleCollapsed :styles.title}>
     <img src={logo_up} alt="Up" />
     </div>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]} // Atualizando a seleção com base na rota
        openKeys={openKeys}
        items={items}
        style={{ height: "90vh" }}
        onClick={handleClick} // Atualiza o item selecionado
        onOpenChange={handleOpenChange} // Controla os submenus abertos
      />

      <div style={{width: '257px', color: 'red', backgroundColor: 'white'}}>
        <h2 style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={handleLogout}>Sair</h2>
      </div>
    </div>
    
  );
};

export default MyMenu;
