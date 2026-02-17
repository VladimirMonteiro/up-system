import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Card,
  message,
  Input,
} from 'antd';
import {
  DeleteOutlined,
  FilePdfOutlined,
  SwapOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import api from '../../../utils/api';

const { Search } = Input;

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const rowsPerPage = 14;
  const navigate = useNavigate();

  // ===============================
  // 🔎 Buscar dados no backend
  // ===============================
  const fetchData = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: rowsPerPage,
      };

      if (term.trim() !== '') params.search = term.trim();

      const response = await api.get('/budgets', { params });

      setBudgets(response.data.content || []);
      setTotalElements(response.data.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      message.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, '');
  }, []);

  // ===============================
  // 💰 Formatar moeda
  // ===============================
  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value ?? 0));

  // ===============================
  // 🎨 Tag de Status
  // ===============================
  const getStatusTag = (status) => {
    const map = {
      Ativo: 'blue',
      Convertido: 'green',
      Cancelado: 'red',
    };

    return <Tag color={map[status] || 'default'}>{status}</Tag>;
  };

  // ===============================
  // 🗑 Deletar
  // ===============================
  const handleDeleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      message.success('Removido com sucesso');
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error(error);
      message.error('Erro ao remover');
    }
  };

  // ===============================
  // 📄 Abrir PDF
  // ===============================
  const openPdf = async (id) => {
    message.loading({ content: 'Abrindo PDF...', key: 'pdf' });

    try {
      const response = await api.get(`/budgets/pdf/${id}`, {
        responseType: 'blob',
      });

      const file = new Blob([response.data], {
        type: 'application/pdf',
      });

      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');

      message.success({ content: 'PDF aberto', key: 'pdf' });
    } catch (error) {
      console.error(error);
      message.error({ content: 'Erro ao abrir PDF', key: 'pdf' });
    }
  };

  // ===============================
  // 🔄 Converter para Rent
  // ===============================
  const convertToRent = async (id) => {
    message.loading({ content: 'Convertendo...', key: 'convert' });

    try {
      const response = await api.post(
        `/rent/budgets/${id}`,
        null,
        { responseType: 'blob' }
      );

      const file = new Blob([response.data], {
        type: 'application/pdf',
      });

      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');

      message.success({ content: 'Convertido com sucesso', key: 'convert' });

      navigate('/alugueis');
    } catch (error) {
      console.error(error);
      message.error({ content: 'Erro ao converter', key: 'convert' });
    }
  };

  // ===============================
  // 📋 Colunas da Tabela
  // ===============================
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Cliente',
      dataIndex: 'clientName',
    },
    {
      title: 'Data',
      dataIndex: 'createAt',
    },
    {
      title: 'Valor Total',
      dataIndex: 'price',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Desconto',
      dataIndex: 'discount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Frete',
      dataIndex: 'freight',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ações',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Deseja remover este orçamento?"
              onConfirm={() => handleDeleteBudget(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>

          <Tooltip title="Abrir PDF">
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => openPdf(record.id)}
            />
          </Tooltip>

          <Tooltip title="Converter em Locação">
            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={() => convertToRent(record.id)}
              disabled={record.status !== 'Ativo'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Orçamentos"
     
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={budgets}
        loading={loading}
        bordered
        pagination={{
          current: currentPage,
          total: totalElements,
          pageSize: rowsPerPage,
          showSizeChanger: false,
          onChange: (page) => fetchData(page, searchTerm),
        }}
      />
    </Card>
  );
};

export default Budgets;
