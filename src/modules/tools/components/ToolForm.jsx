import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

const categories = [
  { value: 'Andaime', label: 'Andaime' },
  { value: 'Elevação', label: 'Elevação' },
  { value: 'Compactação', label: 'Compactação' },
  { value: 'Concretagem', label: 'Concretagem' },
  { value: 'Jardinagem', label: 'Jardinagem' },
  { value: 'Limpeza', label: 'Limpeza' },
  { value: 'Elétricos', label: 'Elétricos' },
  { value: 'Furação e Demolição', label: 'Furação e Demolição' },
  { value: 'Gerador', label: 'Gerador' },
  { value: 'Vibrador', label: 'Vibrador' },
  { value: 'Bomba', label: 'Bomba' },
  { value: 'Compressor', label: 'Compressor' },
  { value: 'Outros', label: 'Outros' },
];

export function ToolForm({ open, onClose, onSubmit, form: propForm, editingTool = null }) {
  const [internalForm] = Form.useForm();
  const form = propForm || internalForm;

  useEffect(() => {
    if (open) {
      if (editingTool) {
        form.setFieldsValue({ ...editingTool });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingTool, form]);

  const handleFinish = async (values) => {
    const ok = await onSubmit(values);
    if (ok) {
      form.resetFields();
      onClose();
    }
  };

  /**
   * FORMATTER (Inspirado na sua lógica)
   * Transforma o valor numérico em máscara: 1250.50 -> R$ 1.250,50
   */
  const currencyFormatter = (value) => {
    if (!value) return 'R$ 0,00';

    // Converte para string garantindo 2 casas decimais (10 -> "1000" para a lógica de máscara)
    const amount = parseFloat(value).toFixed(2).replace(/\D/g, '');

    const decimalPart = amount.slice(-2);
    const integerPart = amount.slice(0, -2);

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${formattedInteger || '0'},${decimalPart}`;
  };

  /**
   * PARSER
   * Remove tudo que não é número e divide por 100 para manter o valor real (decimal)
   */
  const currencyParser = (value) => {
    if (!value) return 0;
    // Remove R$, pontos e outros caracteres, sobrando apenas os dígitos
    const cleanValue = value.replace(/\D/g, '');
    return parseFloat(cleanValue) / 100;
  };

  const priceInputProps = {
    style: { width: '100%' },
    formatter: currencyFormatter,
    parser: currencyParser,
    // No "modo calculadora", não usamos precision/step padrão para não conflitar com a máscara
  };

  return (
    <Modal
      open={open}
      title={editingTool ? 'Editar ferramenta' : 'Cadastrar ferramenta'}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText='Salvar'
      cancelText='Cancelar'
      destroyOnClose
      width={760}
    >
      <Form layout='vertical' form={form} onFinish={handleFinish}>
        <Form.Item
          label='Nome da ferramenta'
          name='name'
          rules={[{ required: true, message: 'Informe o nome' }]}
        >
          <Input placeholder='Ex: Furadeira de Impacto' />
        </Form.Item>

        <Form.Item
          label='Categoria'
          name='category'
          rules={[{ required: true, message: 'Selecione a categoria' }]}
        >
          <Select placeholder='Selecione'>
            {categories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Quantidade total'
              name='totalQuantity'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Quantidade Em manutenção'
              name='quantityMaintenance'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Diária'
              name='daily'
              rules={[{ required: true, message: 'obrigatório' }]}
            >
              <InputNumber {...priceInputProps} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Semanal'
              name='week'
              rules={[{ required: true, message: 'obrigatório' }]}
            >
              <InputNumber {...priceInputProps} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='15 dias'
              name='biweekly'
              rules={[{ required: true, message: 'obrigatório' }]}
            >
              <InputNumber {...priceInputProps} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='21 dias'
              name='twentyOneDays'
              rules={[{ required: true, message: 'obrigatório' }]}
            >
              <InputNumber {...priceInputProps} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='Mensal'
              name='priceMonth'
              rules={[{ required: true, message: 'obrigatório' }]}
            >
              <InputNumber {...priceInputProps} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
