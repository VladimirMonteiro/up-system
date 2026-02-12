import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Typography,
  Divider,
  Row,
  Col,
  message,
} from 'antd';
import {
  FileDoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  FormOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import api from '../../utils/api';
import { handlePriceChange } from '../../utils/handlePriceChange';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CompleteRent = ({ client, tool, price, quantity, listItems }) => {
  const [loading, setLoading] = useState(false);
  const [freight, setFreight] = useState(0);
  const [discount, setDiscount] = useState(0); // Novo campo
  const [obs, setObs] = useState('');

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const finishRent = async (values) => {
    const { initialDate, deliveryDate } = values;

    const updatedListItems = listItems.map((item) => {
      const { tool, ...rest } = item;
      return rest;
    });

    const totalValue =
      updatedListItems.reduce((total, item) => total + item.price * item.quantity, 0) +
      (freight ? parseFloat(freight) : 0) -
      (discount ? parseFloat(discount) : 0);

    if (isNaN(totalValue)) {
      message.error('Algum valor da lista de locação não foi informado!');
      return;
    }

    const newRent = {
      client: {
        id: client.id,
        type: client.cnpj ? 'clientPJ' : 'clientFS',
      },
      items: updatedListItems,
      price: totalValue,
      initialDate: initialDate.format('YYYY-MM-DD'),
      deliveryDate: deliveryDate.format('YYYY-MM-DD'),
      obs,
      freight: freight ? parseFloat(freight) : 0,
      discount: discount ? parseFloat(discount) : 0,
    };

    setLoading(true);

    try {
      const response = await api.post('/rent/create', newRent, {
        responseType: 'blob', // Importante para o PDF
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL);

      message.success('Locação finalizada e contrato gerado!');
      navigate('/alugueis');
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();

        reader.onload = () => {
          const errorData = JSON.parse(reader.result);
          const msg = errorData.errors?.[0] || 'Erro ao processar locação';
          message.error(msg);
        };

        reader.readAsText(error.response.data);
      } else {
        message.error('Erro de comunicação com o servidor.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card style={{ border: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <FileDoneOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          <Title level={3} style={{ marginTop: '12px' }}>
            Finalizar Locação
          </Title>
          <Text type='secondary'>Preencha os dados finais para gerar o contrato</Text>
        </div>

        <Form form={form} layout='vertical' onFinish={finishRent} requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Data Inicial'
                name='initialDate'
                rules={[{ required: true, message: 'Informe a data inicial' }]}
              >
                <DatePicker
                  format='DD/MM/YYYY'
                  style={{ width: '100%' }}
                  placeholder='Selecione'
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Data Final'
                name='deliveryDate'
                rules={[{ required: true, message: 'Informe a data final' }]}
              >
                <DatePicker
                  format='DD/MM/YYYY'
                  style={{ width: '100%' }}
                  placeholder='Selecione'
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Frete (R$)'>
                <Input
                  placeholder='0,00'
                  prefix={<DollarOutlined />}
                  onChange={(e) => handlePriceChange(e, setFreight)}
                  value={freight || ''}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Desconto (R$)'>
                <Input
                  placeholder='0,00'
                  prefix={<DollarOutlined style={{ color: '#ff4d4f' }} />}
                  onChange={(e) => handlePriceChange(e, setDiscount)}
                  value={discount || ''}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label='Observações (Opcional)'>
            <TextArea
              rows={3}
              placeholder='Notas sobre a entrega, estado do equipamento, etc.'
              onChange={(e) => setObs(e.target.value)}
              value={obs}
              showCount
              maxLength={255}
            />
          </Form.Item>

          <Divider />

          <Button
            type='primary'
            htmlType='submit'
            block
            size='large'
            loading={loading}
            icon={<FileDoneOutlined />}
            style={{
              height: '50px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {loading ? 'Finalizando...' : 'Finalizar Locação e Gerar PDF'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CompleteRent;
