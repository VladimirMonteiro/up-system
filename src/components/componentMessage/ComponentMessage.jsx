// ComponentMessage.js
import { useState, useEffect } from 'react';
import styles from './ComponentMessage.module.css';

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
        <div
            className={`${styles.toast} ${styles[type]} ${showMessage ? styles.show : ''}`}
        >
            <span>{message}</span>
            <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
    );
};

export default ComponentMessage;
