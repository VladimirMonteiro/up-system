import styles from './styles.module.css';
import { Input, Select, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../../../../../components/Heading';

export function RentsHeader({ clientName, rentStatus, setClientName, setRentStatus, fetchRents }) {
  const navigate = useNavigate();

  const handleSearch = () => {
    fetchRents(0);
  };

  return (
    <>
      <div className={styles.header}>
        <Heading title='Aluguéis' description='Gerencie todas as locações da empresa' />

        <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/alugar')}>
          Nova Locação
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder='Buscar por cliente...'
          prefix={<SearchOutlined />}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          onPressEnter={handleSearch}
        />

        <Select
          placeholder='Status'
          style={{ width: 200 }}
          value={rentStatus || undefined}
          onChange={setRentStatus}
          options={[
            { label: 'Todos', value: '' },
            { label: 'Ativo', value: 'ACTIVE' },
            { label: 'Finalizado', value: 'FINISHED' },
            { label: 'Atrasado', value: 'OVERDUE' },
          ]}
        />

        <Button type='primary' onClick={handleSearch}>
          Filtrar
        </Button>
      </div>
    </>
  );
}
