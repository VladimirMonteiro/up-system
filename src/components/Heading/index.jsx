import { Typography } from 'antd';

import styles from './styles.module.css';

const { Title, Text } = Typography;

export function Heading({ title, description }) {
  return (
    <div className={styles.headingContainer}>
      <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
        {title}
      </Title>
      <Text type='secondary' style={{ fontSize: '15px' }}>
        {description}
      </Text>
    </div>
  );
}
