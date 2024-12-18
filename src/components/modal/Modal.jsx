// Modal.jsx
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
