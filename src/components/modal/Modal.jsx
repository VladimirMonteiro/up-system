// components/Modal/Modal.jsx
import { Modal as AntModal } from 'antd';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children, width = 600, height }) => {
  return (
    <AntModal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={width}
      destroyOnClose
      centered
      className={styles.modalContainer}
      styles={{
        body: {
          height: height,
          overflowY: height ? 'auto' : 'visible',
        },
      }}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
