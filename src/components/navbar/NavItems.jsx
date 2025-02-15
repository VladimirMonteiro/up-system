import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import { NavLink } from 'react-router-dom';
export const items = [

    {
        key: '0',
        icon: <PieChartOutlined />,
        label: <NavLink to="/inicial"
       >Inicial</NavLink>,
      },
    {
      key: '1',
      icon: <PieChartOutlined />,
      label: <NavLink to="/alugar"
     >Alugar</NavLink>,
    },
    {
      key: '2',
      icon: <DesktopOutlined />,
      label: <NavLink to="/ferramentas"
      >Ferramentas</NavLink>,
    },
    
    {
      key: '3',
      icon: <ContainerOutlined />,
      label: <NavLink to="/clientes"
      >Clientes</NavLink>,
    },
    {
      key: '4',
      icon: <ContainerOutlined />,
      label: <NavLink to="/alugueis"
      >Alugueis</NavLink>,
    },
    {
      key: 'sub1',
      label: 'Financeiro',
      icon: <MailOutlined />,
      children: [
        {
          key: '5',
          label: 'Faturamento',
        },
        {
          key: '6',
          label: 'Despezas',
        },
        {
          key: '7',
          label: 'Option 7',
        },
        {
          key: '8',
          label: 'Option 8',
        },
      ],
    }
  ];

  
