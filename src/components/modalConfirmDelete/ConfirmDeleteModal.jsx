import React from 'react';
import styles from './ConfirmDeleteModal.module.css';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, itemName, remove, completeRent}) => {
  if (!open) return null;

  return (
    <>
      {remove & remove === true ? (
         <div className={styles.backdrop}>
         <div className={styles.modal} >
           <h2 className={styles.title}>Confirmar Exclusão</h2>
           <p className={styles.description}>
             Tem certeza que deseja excluir <strong>{itemName}</strong>? Essa ação não pode ser desfeita.
           </p>
           <div className={styles.actions}>
             <button className={styles.cancelButton} onClick={onClose}>
               Cancelar
             </button>
             <button className={styles.confirmButton} onClick={onConfirm}>
               Confirmar
             </button>
           </div>
         </div>
       </div>
      ) : (
        <div className={styles.backdrop}>
        <div className={styles.modal} >
          <h2 className={styles.title}>Finalizar Contrato</h2>
          <p className={styles.description}>
            Tem certeza que deseja Concluir a locação de <strong>{itemName}</strong>? Essa ação não pode ser desfeita.
          </p>
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.completeRentBtn} onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
           
      )}  
    </>

  );
};

export default ConfirmDeleteModal;