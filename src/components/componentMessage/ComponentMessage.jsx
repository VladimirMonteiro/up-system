// ComponentMessage.js
import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import styles from './ComponentMessage.module.css';

const ComponentMessage = ({ message, type = 'success', onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!message) return;

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      onClose?.(); // só chama se existir
    }, 4500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!show) return null;

  return (
    <Alert
      message={type === 'success' ? 'Sucesso' : 'Erro'}
      description={message}
      type={type}
      showIcon
      closable
      onClose={() => {
        setShow(false);
        onClose?.();
      }}
      className={styles.alert}
    />
  );
};

export default ComponentMessage;
