import { MdDelete, MdOutlineDoneOutline } from 'react-icons/md';
import { FaPaste, FaPen } from 'react-icons/fa';

const RentsActions = ({ rent, onDelete, onComplete, onPdf, onEdit }) => {
  return (
    <>
      <MdDelete
        color="red"
        onClick={() => onDelete(rent.id)}
        title="Excluir"
      />

      <FaPen
        onClick={() => onEdit(rent.id)}
        title="Editar"
      />

      <FaPaste
        onClick={() => onPdf(rent)}   // 🔥 PASSA O OBJETO INTEIRO
        title="Gerar PDF"
      />

      <MdOutlineDoneOutline
        color="green"
        onClick={() => onComplete(rent.id)}
        title="Concluir"
      />
    </>
  );
};

export default RentsActions;
