// ComponentMessage.js
import { useState, useEffect } from 'react';
import styles from './ComponentMessage.module.css';
import { Alert } from 'antd';

const ComponentMessage = ({ message, type, onClose }) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (message) {
            setShowMessage(true);

            // Esconde a mensagem após 5 segundos
            const timer = setTimeout(() => {
                setShowMessage(false);
                onClose(); // Limpa a mensagem de sucesso ou erro no componente pai
            }, 2500);

            return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado antes
        }
    }, [message, onClose]);

    return (
        <Alert
        message="Sucesso!"
        description={message}
        type="success"
        showIcon
        style={{width: '300px', height: 'auto', position: 'absolute', left: '50%', top: '0', zIndex: '99', margin: '20px'}}
      />
    );
};

export default ComponentMessage;
