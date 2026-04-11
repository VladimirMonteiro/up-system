import { Card, Table, Tag, Dropdown, Popconfirm, message, Modal, Form, Select } from 'antd';
import {
  MoreOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  QrcodeOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import styles from './styles.module.css';
import { formateNumber } from '../../../../../utils/formatNumber';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatCpfCnpj } from '../../../../../utils/formatCpfOrCnpj';

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

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedRentId, setSelectedRentId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirmComplete = async () => {
    try {
      const values = await form.validateFields();

      setConfirmLoading(true);

      await completeRent(selectedRentId, values.method);

      setIsCompleteModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const [form] = Form.useForm();

  const navigate = useNavigate();

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
      render: (clientDocument) => <strong>{formatCpfCnpj(clientDocument)}</strong>,
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
                onClick: () => {
                  navigate(`/alugueis/${record.id}`);
                },
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
                onClick: async () => {
                  // ✅ Se já está pago → finaliza direto
                  if (record.paymentStatus === 'Pago') {
                    await completeRent(record.id, null);
                    return;
                  }

                  // ❗ Se não está pago → abrir modal
                  setSelectedRentId(record.id);
                  setIsCompleteModalOpen(true);
                },
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
    <>
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
      {/* ===============================
          MODAL FINALIZAR LOCAÇÃO
         =============================== */}
      <Modal
        title='Finalizar Locação'
        open={isCompleteModalOpen}
        onCancel={() => {
          setIsCompleteModalOpen(false);
          form.resetFields();
        }}
        onOk={handleConfirmComplete}
        okText='Finalizar'
        cancelText='Cancelar'
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Método de Pagamento'
            name='method'
            rules={[{ required: true, message: 'Selecione o método' }]}
          >
            <Select placeholder='Selecione...'>
              <Select.Option value='Pix'>
                <QrcodeOutlined style={{ color: '#22c55e', marginRight: 8 }} />
                PIX
              </Select.Option>

              <Select.Option value='Dinheiro'>
                <DollarOutlined style={{ color: '#16a34a', marginRight: 8 }} />
                Dinheiro
              </Select.Option>

              <Select.Option value='Crédito'>
                <CreditCardOutlined style={{ color: '#2563eb', marginRight: 8 }} />
                Crédito
              </Select.Option>

              <Select.Option value='Débito'>
                <WalletOutlined style={{ color: '#7c3aed', marginRight: 8 }} />
                Débito
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
