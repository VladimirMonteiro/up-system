import styles from './styles.module.css';

import { Input, Select, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { Heading } from '../../../../../components/Heading';

export function RentsHeader({ filters, setFilters, isFiltering, setIsFiltering }) {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.header}>
        <div>
          <Heading title='Aluguéis' description='Gerencie todas as locações da empresa' />
        </div>

        <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/alugar')}>
          Nova Locação
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder='Buscar por cliente...'
          prefix={<SearchOutlined />}
          value={filters.clientName}
          onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
        />

        <Select
          placeholder='Status'
          style={{ width: 200 }}
          value={filters.rentStatus}
          onChange={(value) => setFilters({ ...filters, rentStatus: value })}
          options={[
            { label: 'Todos', value: '' },
            { label: 'Ativo', value: 'ACTIVE' },
            { label: 'Finalizado', value: 'FINISHED' },
            { label: 'Atrasado', value: 'OVERDUE' },
          ]}
        />

        <Button type='primary' onClick={() => setIsFiltering(true)}>
          Filtrar
        </Button>

        <Button
          onClick={() => {
            setFilters({ clientName: '', rentStatus: '' });
            setIsFiltering(false);
          }}
        >
          Limpar
        </Button>
      </div>
    </>
  );
}
