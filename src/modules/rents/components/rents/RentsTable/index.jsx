import { Card, Table, Tag, Dropdown, Popconfirm, message } from 'antd';
import {
  MoreOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import styles from './styles.module.css';
import { formateNumber } from '../../../../../utils/formatNumber';

export function RentsTable({
  rents,
  loading,
  page,
  totalPages,
  setPage,
  openContractPdf,
  completeRent,
  deleteRent,
  openPayments, // 👈 NOVA PROP
}) {
  const handleOpenContract = async (record) => {
    const hide = message.loading('Gerando contrato...', 0);

    try {
      await openContractPdf(record);
    } catch (error) {
      message.error('Erro ao gerar contrato');
      console.error(error);
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id) => `R${String(id).padStart(4, '0')}`,
    },
    {
      title: 'Cliente',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'CPF/CNPJ',
      dataIndex: 'clientDocument',
      key: 'clientDocument',
      render: (clientDocument) => <strong>{clientDocument}</strong>,
    },
    {
      title: 'Período',
      key: 'period',
      render: (_, r) => `${r.initialDate} - ${r.deliveryDate}`,
    },
    {
      title: 'Valor',
      dataIndex: 'price',
      key: 'price',
      render: (value) => <strong>{formateNumber(value)}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'rentStatus',
      key: 'rentStatus',
      render: (status) => {
        const map = { Ativo: 'blue', Finalizada: 'green', Atrasada: 'red' };
        const label = {
          Ativo: 'Ativo',
          Finalizada: 'Finalizado',
          Atrasada: 'Atrasado',
        };
        return <Tag color={map[status]}>{label[status]}</Tag>;
      },
    },
    {
      title: 'Entrega',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      render: (status) => {
        const map = { Entregue: 'green', Pendente: 'red' };
        const label = { Entregue: 'Finalizado', Pendente: 'Pendente' };
        return <Tag color={map[status]}>{label[status]}</Tag>;
      },
    },
    {
      title: 'Pagamento',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        const map = {
          Pago: 'green',
          'Parc pago': 'orange',
          'Não pago': 'red',
        };
        const label = {
          Pago: 'Finalizado',
          'Parc pago': 'Parc pago',
          'Não pago': 'Não pago',
        };
        return <Tag color={map[status] || 'default'}>{label[status] || status}</Tag>;
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: '1',
                icon: <EyeOutlined style={{ color: '#1890ff' }} />,
                label: 'Ver Detalhes',
              },
              {
                key: '2',
                icon: <DollarOutlined style={{ color: '#52c41a' }} />,
                label: 'Pagamentos',
                onClick: () => openPayments(record), // 👈 AQUI
              },
              {
                key: '3',
                icon: <FileTextOutlined style={{ color: '#fa8c16' }} />,
                label: 'Visualizar Contrato',
                onClick: () => handleOpenContract(record),
              },
              //{
              //  key: '4',
              //  icon: <ReloadOutlined style={{ color: '#fa541c' }} />,
              //  label: 'Renovar',
              //},
              {
                key: '5',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                label: 'Finalizar',
                onClick: () => completeRent(record.id),
              },
              { type: 'divider' },
              {
                key: '6',
                danger: true,
                icon: <DeleteOutlined />,
                label: (
                  <Popconfirm
                    title='Excluir locação'
                    description='Tem certeza que deseja excluir esta locação? Essa ação não pode ser desfeita.'
                    okText='Sim, excluir'
                    cancelText='Cancelar'
                    onConfirm={() => deleteRent(record.id)}
                  >
                    <span>Excluir</span>
                  </Popconfirm>
                ),
              },
            ],
          }}
        >
          <MoreOutlined className={styles.moreIcon} style={{ color: '#000' }} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Card className={styles.tableCard}>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={rents}
        loading={loading}
        pagination={{
          current: page + 1,
          total: totalPages * 15,
          pageSize: 15,
          onChange: (p) => setPage(p - 1),
          showSizeChanger: false,
        }}
      />
    </Card>
  );
}
