import {
  Modal,
  Card,
  Progress,
  Form,
  InputNumber,
  Select,
  Input,
  Button,
  Table,
  Tag,
  Row,
  Col,
  DatePicker,
  Popconfirm,
} from 'antd';
import dayjs from 'dayjs';

import {
  QrcodeOutlined,
  DollarOutlined,
  CreditCardOutlined,
  WalletOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { formateNumber } from '../../../../../utils/formatNumber';

const { TextArea } = Input;

export function PaymentsModal({
  open,
  onClose,
  rent,
  data,
  onRegisterPayment,
  onDeletePayment,
  loading,
}) {
  if (!open || !rent || !data) return null;

  const { price, totalPaid, remaining, progress, payments } = data;

  const progressColor = progress === 100 ? '#22c55e' : progress >= 70 ? '#2563eb' : '#f59e0b';

  console.log(rent, data);
  const columns = [
    {
      title: 'Data',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
    },
    {
      title: 'Método',
      dataIndex: 'method',
      key: 'method',
      render: (method) => <Tag color='blue'>{method}</Tag>,
    },
    {
      title: 'Observação',
      dataIndex: 'observation',
      key: 'observation',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (value) => <strong style={{ color: '#16a34a' }}>{formateNumber(value)}</strong>,
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title='Excluir pagamento'
          description='Tem certeza que deseja excluir este pagamento?'
          okText='Sim'
          cancelText='Não'
          onConfirm={() => onDeletePayment(record.id)}
        >
          <Button danger type='text' icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      title={`Pagamentos - ${rent.clientName} - Locação #${rent.id}`}
    >
      {/* ===== RESUMO ===== */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <span>Valor Total</span>
            <h3>{formateNumber(data.totalRent)}</h3>
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ background: '#ecfdf5' }}>
            <span>Pago</span>
            <h3 style={{ color: '#16a34a' }}>{formateNumber(totalPaid)}</h3>
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ background: '#fef2f2' }}>
            <span>Restante</span>
            <h3 style={{ color: '#dc2626' }}>{formateNumber(remaining)}</h3>
          </Card>
        </Col>
      </Row>

      {/* ===== PROGRESSO ===== */}
      <div style={{ marginTop: 24 }}>
        <span>Progresso do pagamento</span>
        <Progress percent={progress} strokeColor={progressColor} />
      </div>

      {/* ===== NOVO PAGAMENTO ===== */}
      <Card
        style={{ marginTop: 24 }}
        title={
          <>
            <PlusOutlined /> Novo Pagamento
          </>
        }
      >
        <Form layout='vertical' onFinish={onRegisterPayment}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Valor (R$)'
                name='value'
                rules={[{ required: true, message: 'Informe o valor' }]}
              >
                <InputNumber min={0} max={remaining} style={{ width: '100%' }} prefix='R$' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Data do Pagamento'
                name='paymentDate'
                rules={[{ required: true, message: 'Informe a data do pagamento' }]}
                initialValue={dayjs()} // 👈 hoje por padrão
              >
                <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Método'
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
            </Col>
          </Row>

          <Form.Item label='Observações' name='note'>
            <TextArea rows={3} placeholder='Ex: Entrada, parcela 2/3...' />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type='primary' htmlType='submit' icon={<DollarOutlined />} loading={loading}>
              Registrar Pagamento
            </Button>
          </div>
        </Form>
      </Card>

      {/* ===== HISTÓRICO ===== */}
      <Card style={{ marginTop: 24 }} title='Histórico de Pagamentos'>
        <Table columns={columns} dataSource={payments} rowKey='id' pagination={false} />
      </Card>
    </Modal>
  );
}
