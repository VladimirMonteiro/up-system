import Modal from "../../../../components/modal/Modal";
import Table from "../../../../components/tableClients/Table";

const RentClientSelector = ({ open, onClose, onSelect }) => {
  return (
    <Modal isOpen={open} onClose={onClose} height="90vh">
      <h2>Selecionar Cliente</h2>
      <Table selected={onSelect} />
    </Modal>
  );
};

export default RentClientSelector;
