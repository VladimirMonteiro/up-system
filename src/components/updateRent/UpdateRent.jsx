import { useState, useEffect } from 'react';
import {
  Form, Input, Button, DatePicker, Card, Row, Col, Typography,
  Tag, Divider, Alert, Table, InputNumber, Statistic, Space, Progress
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, DeleteOutlined, 
  CheckCircleOutlined, SyncOutlined, ArrowLeftOutlined,
  InfoCircleOutlined, ShoppingCartOutlined, WalletOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

import api from '../../utils/api';
import Modal from '../modal/Modal';
import TableTools from '../tableTools/TableTools';
import { formatInputToCurrency, parseCurrencyToFloat } from '../../utils/formatCurrency';
import { formateNumber } from '../../utils/formatNumber';
import styles from './UpdateRent.module.css';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const UpdateRent = ({ rent }) => {
  const [form] = Form.useForm();
  
  const [client, setClient] = useState({});
  const [listItems, setListItems] = useState([]);
  const [freight, setFreight] = useState("");
  const [discount, setDiscount] = useState("");
  const [obs, setObs] = useState("");
  const [isToolModalOpen, setToolModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [stateRent, setStateRent] = useState("");
  const [loading, setLoading] = useState(false);

  const [paymentsInfo, setPaymentsInfo] = useState({
    totalRent: 0,
    totalPaid: 0,
    remaining: 0,
    progress: 0,
    payments: []
  });

  const navigate = useNavigate();

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split("/");
      return dayjs(`${year}-${month}-${day}`);
    }
    return dayjs(dateStr);
  };

  useEffect(() => {
    if (rent) {
      setClient(rent.client || {});
      setListItems(rent.rentItems || []);
      setFreight(rent.freight || "");
      setDiscount(rent.discount || "");
      setObs(rent.obs || "");
      setStateRent(rent.stateRent || "");
      
      form.setFieldsValue({
        initialDate: formatDateForInput(rent.initialDate),
        deliveryDate: formatDateForInput(rent.deliveryDate),
        obs: rent.obs || ""
      });

      fetchPaymentsDTO(rent.id);
    }
  }, [rent, form]);

  const fetchPaymentsDTO = async (id) => {
    try {
      const response = await api.get(`/payments/rent/${id}`);
      setPaymentsInfo(response.data);
    } catch (err) {
      console.error("Erro ao buscar DTO de pagamentos:", err);
    }
  };

  const openTools = (e) => { if (e) e.preventDefault(); setToolModalOpen(true); };
  const closeToolModal = () => setToolModalOpen(false);

  const handleUpdateItem = (index, updatedItem) => {
    const updatedList = [...listItems];
    updatedList[index] = updatedItem;
    setListItems(updatedList);
  };

  const handleDeleteItem = (index) => {
    setListItems(listItems.filter((_, i) => i !== index));
  };

  const handleSelectTool = (tool) => {
    if (!listItems.some(item => item.tool.id === tool.id)) {
      setListItems(prev => [...prev, { tool, quantity: 1, price: tool.price || 0 }]);
    }
    closeToolModal();
  };

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      rentId: rent.id,
      items: listItems.map(item => ({
        toolId: item.tool.id,
        quantity: item.quantity,
        price: parseCurrencyToFloat(item.price),
      })),
      initialDate: values.initialDate?.format('YYYY-MM-DD'),
      deliveryDate: values.deliveryDate?.format('YYYY-MM-DD'),
      freight: parseCurrencyToFloat(freight),
      discount: parseCurrencyToFloat(discount),
      obs: obs,
    };

    try {
      const response = await api.put(`/rent/update/${rent.id}`, payload);
      setSuccess(response.data.message || "Atualizado com sucesso!");
      fetchPaymentsDTO(rent.id); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDeliveryStatus = async () => {
    try {
      const response = await api.put(`/rent/${rent.id}/deliveryTool`);
      const updated = response.data?.state || (stateRent === "DELIVERED" ? "PENDING" : "DELIVERED");
      setStateRent(updated);
      setSuccess(`Entrega marcada como ${updated === "DELIVERED" ? "CONCLUÍDA" : "PENDENTE"}`);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Ferramenta',
      dataIndex: ['tool', 'name'],
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Qtd',
      key: 'quantity',
      width: 80,
      render: (_, record, index) => (
        <InputNumber 
          min={1} 
          value={record.quantity} 
          onChange={(val) => handleUpdateItem(index, { ...record, quantity: val })}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Preço Unit.',
      key: 'price',
      width: 130,
      render: (_, record, index) => (
        <Input 
          value={record.price}
          onChange={(e) => handleUpdateItem(index, { 
            ...record, 
            price: formatInputToCurrency(e.target.value) 
          })}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      align: 'right',
      render: (_, record) => (
        <Text strong>{formateNumber(record.quantity * parseCurrencyToFloat(record.price))}</Text>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, __, index) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteItem(index)} />
      ),
    },
  ];

  return (
    <div className={styles.container} style={{ padding: '16px', background: '#f8fafc', minHeight: '100vh' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
        <Space size="large">
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/alugueis')} />
          <div>
            <Title level={3} style={{ margin: 0 }}>Atualizar Locação</Title>
            <Text type="secondary">Contrato de <Text strong>{client.name}</Text></Text>
          </div>
        </Space>
        
        <Space direction="vertical" align="end" style={{ minWidth: 200 }}>
          <Text size="small" type="secondary">Progresso do Recebimento</Text>
          <Progress 
            percent={paymentsInfo.progress} 
            status={paymentsInfo.progress >= 100 ? "success" : "active"} 
            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            style={{ width: 180 }}
          />
        </Space>
      </header>

      {success && <Alert message={success} type="success" showIcon closable style={{ marginBottom: 24 }} />}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          
          <Col xs={24} xxl={17} xl={16}>
            <Card title={<Space><InfoCircleOutlined /> Dados da Locação</Space>} variant="borderless">
              <Row gutter={[16, 16]}>
                {/* Ajuste para 1515px: xl={12} faz ficar 2 por linha, xxl={6} faz ficar 4 por linha */}
                <Col xs={24} sm={12} xl={12} xxl={6}>
                  <Form.Item name="initialDate" label="Data de Saída">
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} xl={12} xxl={6}>
                  <Form.Item name="deliveryDate" label="Previsão de Devolução">
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} xl={12} xxl={6}>
                  <Form.Item label="Frete">
                    <Input 
                      value={freight}
                      onChange={(e) => setFreight(formatInputToCurrency(e.target.value))}
                      placeholder="R$ 0,00"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} xl={12} xxl={6}>
                  <Form.Item label="Desconto">
                    <Input 
                      value={discount}
                      onChange={(e) => setDiscount(formatInputToCurrency(e.target.value))}
                      placeholder="R$ 0,00"
                      style={{ color: '#cf1322' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ marginTop: 8 }}>
                <Col span={24}>
                  <Form.Item label={<Space><FileTextOutlined /> Observações Internas</Space>}>
                    <TextArea 
                      rows={3} 
                      value={obs} 
                      onChange={(e) => setObs(e.target.value)} 
                      placeholder="Alguma nota importante sobre esta locação..." 
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card 
              title={<Space><ShoppingCartOutlined /> Itens Selecionados</Space>}
              style={{ marginTop: 24 }}
              extra={<Button type="primary" ghost icon={<PlusOutlined />} onClick={openTools}>Adicionar Ferramenta</Button>}
            >
              <Table 
                dataSource={listItems} 
                columns={columns} 
                pagination={false}
                rowKey={(record) => record.tool.id}
                scroll={{ x: 700 }}
              />
              <Divider />
              <div style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Text type="secondary">Estado da Entrega:</Text>
                  <Tag color={stateRent === "DELIVERED" ? "green" : "blue"} icon={stateRent === "DELIVERED" ? <CheckCircleOutlined /> : <SyncOutlined spin />}>
                    {stateRent === "DELIVERED" ? "ENTREGUE" : "PENDENTE"}
                  </Tag>
                  <Button size="small" onClick={toggleDeliveryStatus}>Mudar Status</Button>
                </Space>
              </div>
            </Card>
          </Col>

          <Col xs={24} xxl={7} xl={8}>
            <Card 
              title={<Space><WalletOutlined /> Resumo Financeiro</Space>}
              style={{ position: 'sticky', top: 16, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
            >
              <Statistic title="Subtotal" value={paymentsInfo.totalRent} precision={2} prefix="R$" />
              <Divider style={{ margin: '12px 0' }} />
              <Statistic title="Total Recebido" value={paymentsInfo.totalPaid} precision={2} prefix="R$" valueStyle={{ color: '#3f8600' }} />
              <Statistic 
                title="Saldo Remanescente" 
                value={paymentsInfo.remaining} 
                precision={2} 
                prefix="R$" 
                valueStyle={{ color: paymentsInfo.remaining > 0 ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}
                style={{ marginTop: 12 }}
              />
              
              <Button 
                type="primary" 
                block 
                size="large" 
                icon={<SaveOutlined />} 
                htmlType="submit"
                loading={loading}
                style={{ marginTop: 25, height: 50, borderRadius: 8 }}
              >
                Salvar Alterações
              </Button>

              {paymentsInfo.payments?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <Text type="secondary" strong>Histórico:</Text>
                  <ul style={{ paddingLeft: 20, marginTop: 8, fontSize: '12px', color: '#666' }}>
                    {paymentsInfo.payments.map((p, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                         {p.date || 'Lançamento'}: <Text strong>{formateNumber(p.value)}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal isOpen={isToolModalOpen} onClose={closeToolModal} height={"90vh"} width={'auto'}>
        <Title level={4}>Catálogo de Ferramentas</Title>
        <TableTools selected={handleSelectTool} />
      </Modal>
    </div>
  );
};

export default UpdateRent;