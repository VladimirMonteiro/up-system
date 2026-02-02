import { UserOutlined } from '@ant-design/icons';
import { Card, Table, Space, Tag } from 'antd';

import { Input } from 'antd';
import { useMemo, useState } from 'react';
import { formateNumber } from '../../../../utils/formatNumber';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => `R${String(text).padStart(3, '0')}`, // Formata como R056
  },
  {
    title: 'Cliente',
    dataIndex: ['clientName'],
    key: 'cliente',
  },
  {
    title: 'Período',
    key: 'periodo',
    render: (_, record) => `${record.initialDate} - ${record.deliveryDate}`, // Concatena as datas
  },
  {
    title: 'Qtd',
    key: 'qtd',
    render: (_, record) => record.QuantityToolInRent || 0, // Pega a quantidade de itens no array
  },
  {
    title: 'Valor',
    dataIndex: 'price',
    key: 'valor',
    render: (price) => formateNumber(price), // Usa sua função de formatação
  },
  {
    title: 'Entrega',
    dataIndex: 'stateRent', // Mapeado para "Pendente", "Finalizado", etc.
    key: 'Entrega',
    render: (status) => {
      let color = 'default';
      if (status === 'Entregue') color = 'success';
      if (status === 'Pendente') color = 'warning';
      return (
        <Tag color={color} style={{ borderRadius: '12px', padding: '0 12px' }}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Pagamento',
    dataIndex: 'paymentStatus', // Mapeado para "Pendente", "Finalizado", etc.
    key: 'Pagamento',
    render: (status) => {
      let color = 'default';
      if (status === 'Pago') color = 'success';
      if (status === 'Parc pago') color = 'warning';
      if (status === 'Não pago') color = 'error';
      return (
        <Tag color={color} style={{ borderRadius: '12px', padding: '0 12px' }}>
          {status}
        </Tag>
      );
    },
  },
];

export function RentHistoric({ tool }) {
  const [search, setSearch] = useState('');

  const filteredRents = useMemo(() => {
    if (!search) return tool?.rents || [];

    return tool.rents.filter((rent) => {
      const searchLower = search.toLowerCase();

      return (
        String(rent.id).includes(searchLower) ||
        rent.clientName?.toLowerCase().includes(searchLower) ||
        rent.stateRent?.toLowerCase().includes(searchLower) ||
        rent.paymentStatus?.toLowerCase().includes(searchLower)
      );
    });
  }, [search, tool]);
  return (
    <Card
      title={
        <Space>
          <UserOutlined /> Histórico de Locações
        </Space>
      }
    >
      {/* 🔍 BUSCA */}
      <Input.Search
        placeholder='Buscar por cliente, ID ou status...'
        allowClear
        style={{ maxWidth: 320, marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* --- HISTÓRICO DE LOCAÇÕES --- */}
      <Table
        columns={columns}
        dataSource={filteredRents}
        pagination={{ pageSize: 5 }}
        size='middle'
        rowKey='id'
      />
    </Card>
  );
}
