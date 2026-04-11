import { Layout, Button, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

import styles from './styles.module.css';
import { Heading } from '../../../../components/Heading';

const { Header } = Layout;

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
}) {
  /* =========================
     ESTADOS LOCAIS
  ========================== */
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [localCategory, setLocalCategory] = useState(categoryFilter);
  const [localStatus, setLocalStatus] = useState(statusFilter);

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
          <Select size='large' value={localCategory} onChange={setLocalCategory}>
            <Select.Option value='all'>Todas Categorias</Select.Option>
            <Select.Option value='SCAFFOLDING'>Andaime</Select.Option>
            <Select.Option value='ELEVATION'>Elevação</Select.Option>
            <Select.Option value='COMPACTION'>Compactação</Select.Option>
            <Select.Option value='CONCRETING'>Concretagem</Select.Option>
            <Select.Option value='GARDENING'>Jardinagem</Select.Option>
            <Select.Option value='CLEANING'>Limpeza</Select.Option>
            <Select.Option value='ELECTRIC'>Elétricos</Select.Option>
            <Select.Option value='HURRICANE_DEMOLITION'>Furação e Demolição</Select.Option>
            <Select.Option value='GENERATOR'>Gerador</Select.Option>
            <Select.Option value='VIBRATOR'>Vibrador</Select.Option>
            <Select.Option value='PUMP'>Bomba</Select.Option>
            <Select.Option value='COMPRESSOR'>Compressor</Select.Option>
            <Select.Option value='OTHERS'>Outros</Select.Option>
          </Select>
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
