import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  ContainerOutlined,
  PieChartOutlined,
  ToolOutlined,
  UserOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo_up from "../../assets/logo_up.png";

const MyMenu = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");

  // Definir item ativo com base na rota
  useEffect(() => {
    switch (location.pathname) {
      case "/inicial":
        setSelectedKey("0");
        break;
      case "/alugar":
        setSelectedKey("1");
        break;
      case "/ferramentas":
        setSelectedKey("2");
        break;
      case "/clientes":
        setSelectedKey("3");
        break;
      case "/alugueis":
        setSelectedKey("4");
        break;
      case "/orçamentos":
        setSelectedKey("5");
        break;
      case "/faturamentos":
        setSelectedKey("6");
        break;
      case "/gastos":
        setSelectedKey("7");
        break;
      default:
        setSelectedKey("");
    }
  }, [location]);

  const items = [
    { key: "0", icon: <PieChartOutlined />, label: <NavLink to="/inicial">Inicial</NavLink> },
    { key: "1", icon: <PieChartOutlined />, label: <NavLink to="/alugar">Alugar</NavLink> },
    { key: "2", icon: <ToolOutlined />, label: <NavLink to="/ferramentas">Ferramentas</NavLink> },
    { key: "3", icon: <UserOutlined />, label: <NavLink to="/clientes">Clientes</NavLink> },
    { key: "4", icon: <ContainerOutlined />, label: <NavLink to="/alugueis">Aluguéis</NavLink> },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: (
        <span className="menu-disabled">
          Orçamentos <span className="soon-tag">Em breve</span>
        </span>
      ),
      disabled: true, // 🔒 Ant Design já bloqueia clique
    },
    {
      key: "sub1",
      label: "Relatórios",
      icon: <LineChartOutlined />,
      children: [
        { key: "6", label: <NavLink to="/faturamentos">Faturamentos</NavLink> },
        { key: "7", label: <NavLink to="/gastos">Gastos</NavLink> },
        { key: "8",   label: (
        <span className="menu-disabled">
          Fretes <span className="soon-tag">Em breve</span>
        </span>
      ),
      disabled: true, // 🔒 Ant Design já bloqueia clique },
    }
      ],
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={collapsed ? styles.logoCollapsed : styles.logo}>
        <img src={logo_up} alt="Up" />
      </div>

      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        items={items}
        onOpenChange={(keys) => setOpenKeys(keys)}
      />
    </div>
  );
};

export default MyMenu;
