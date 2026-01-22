import Modal from "../../../../components/modal/Modal";
import TableTools from "../../../../components/tableTools/TableTools";

const RentToolSelector = ({ open, onClose, onSelect }) => {
  return (
    <Modal isOpen={open} onClose={onClose} height="90vh">
      <h2>Selecionar Ferramenta</h2>
      <TableTools selected={onSelect} />
    </Modal>
  );
};

export default RentToolSelector;
