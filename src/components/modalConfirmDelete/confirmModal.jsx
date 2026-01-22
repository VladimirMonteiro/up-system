import { Modal } from 'antd';

const ConfirmModal = ({
  open,
  title,
  description,
  okText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
      centered
    >
      <p>{description}</p>
    </Modal>
  );
};

export default ConfirmModal;
