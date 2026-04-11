import { Card, Typography } from 'antd';
import styles from './styles.module.css';

const { Title, Text } = Typography;

export function Stats({ rentStats }) {
  return (
    <div className={styles.stats}>
      <Card className={styles.cardActive}>
        <Text>Ativos</Text>
        <Title level={3}>{rentStats.quantityRentsActive}</Title>
      </Card>

      <Card className={styles.cardDone}>
        <Text>Finalizados</Text>
        <Title level={3}>{rentStats.quantityRentsFinished}</Title>
      </Card>

      <Card className={styles.cardLate}>
        <Text>Atrasados</Text>
        <Title level={3}>{rentStats.quantityRentsOverdue}</Title>
      </Card>
    </div>
  );
}
