import { Layout, Button, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

import styles from './styles.module.css';
import { Heading } from '../../../../../components/Heading';
import { ToolCategory, ToolFilterStatus } from '../../../../../services/toolService/types';

const { Header } = Layout;

type ToolsManagerHeaderProps = {
  title: string;
  description: string;
  btnText: string;
  inputPlaceholder: string;
  onAddClick: () => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ToolCategory | 'all') => void;
  onStatusChange: (value: ToolFilterStatus | 'all') => void;
  searchValue: string;
  categoryFilter: ToolCategory | 'all';
  statusFilter: ToolFilterStatus | 'all';
};

export function ToolsManagerHeader({
  title,
  description,
  btnText,
  inputPlaceholder,
  onAddClick,

  // callbacks finais (disparam busca)
  onSearchChange,
  onCategoryChange,
  onStatusChange,

  // valores iniciais
  searchValue = '',
  categoryFilter = 'all',
  statusFilter = 'all',
}: ToolsManagerHeaderProps) {
  /* =========================
     ESTADOS LOCAIS
  ========================== */
  const [localSearch, setLocalSearch] = useState<string>(searchValue);
  const [localCategory, setLocalCategory] = useState<ToolCategory | 'all'>(categoryFilter);
  const [localStatus, setLocalStatus] = useState<ToolFilterStatus | 'all'>(statusFilter);

  /* =========================
     AÇÃO DO BOTÃO
  ========================== */
  const handleSearchClick = () => {
    onSearchChange(localSearch);
    onCategoryChange(localCategory);
    onStatusChange(localStatus);
  };

  return (
    <Header className={styles.header}>
      {/* TÍTULO */}
      <Row justify='space-between' align='middle'>
        <Col>
          <Heading title={title} description={description} />
        </Col>

        <Col>
          <Button type='primary' icon={<PlusOutlined />} size='large' onClick={onAddClick}>
            {btnText}
          </Button>
        </Col>
      </Row>

      {/* FILTROS */}
      <Row
        gutter={16}
        className={styles.filters}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Col style={{ width: '35%' }}>
          <Input
            size='large'
            placeholder={inputPlaceholder}
            prefix={<SearchOutlined />}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onPressEnter={handleSearchClick}
          />
        </Col>

        <Col>
          <Select
            size='large'
            value={localCategory}
            onChange={(value) => setLocalCategory(value)}
            options={[
              { value: 'all', label: 'Todas Categorias' },
              { value: 'SCAFFOLDING', label: 'Andaime' },
              { value: 'ELEVATION', label: 'Elevação' },
              { value: 'COMPACTION', label: 'Compactação' },
              { value: 'CONCRETING', label: 'Concretagem' },
              { value: 'GARDENING', label: 'Jardinagem' },
              { value: 'CLEANING', label: 'Limpeza' },
              { value: 'ELECTRIC', label: 'Elétricos' },
              { value: 'HURRICANE_DEMOLITION', label: 'Furação e Demolição' },
              { value: 'GENERATOR', label: 'Gerador' },
              { value: 'VIBRATOR', label: 'Vibrador' },
              { value: 'PUMP', label: 'Bomba' },
              { value: 'COMPRESSOR', label: 'Compressor' },
              { value: 'OTHERS', label: 'Outros' },
            ]}
          />
        </Col>

        <Col>
          <Select size='large' value={localStatus} onChange={setLocalStatus}>
            <Select.Option value='all'>Todos Status</Select.Option>
            <Select.Option value='AVAILABLE'>Disponível</Select.Option>
            <Select.Option value='OUT_OF_STOCK'>Indisponível</Select.Option>
            <Select.Option value='RENTED'>Alugado</Select.Option>
            <Select.Option value='MAINTENANCE'>Manutenção</Select.Option>
          </Select>
        </Col>

        <Col>
          <Button type='primary' icon={<SearchOutlined />} size='large' onClick={handleSearchClick}>
            Pesquisar
          </Button>
        </Col>
      </Row>
    </Header>
  );
}
