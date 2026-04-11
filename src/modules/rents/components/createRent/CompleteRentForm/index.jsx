import Modal from '../../../../../components/modal/Modal';
import { useCompleteRent } from '../../../hooks/useCompleteRent';
import styles from './styles.module.css';

const CompleteRentModal = ({ open, onClose, client, listItems }) => {
  if (!open || !client?.id || listItems.length === 0) return null;

  const {
    initialDate,
    deliveryDate,
    freight,
    obs,
    loading,
    setInitialDate,
    setDeliveryDate,
    setFreight,
    setObs,
    finishRent,
    totalItems,
  } = useCompleteRent({ client, listItems });

  return (
    <Modal isOpen={open} onClose={onClose} width='500px'>
      <form
        className={styles.modalForm}
        onSubmit={(e) => {
          e.preventDefault();
          finishRent();
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Finalizar Locação</h2>

        <label>
          Data inicial
          <input type='date' value={initialDate} onChange={(e) => setInitialDate(e.target.value)} />
        </label>

        <label>
          Data final
          <input
            type='date'
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </label>

        <label>
          Frete
          <input type='number' value={freight} onChange={(e) => setFreight(e.target.value)} />
        </label>

        <label>
          Observações
          <textarea value={obs} onChange={(e) => setObs(e.target.value)} />
        </label>

        <strong className={styles.modalTotal}>Total: R$ {totalItems.toFixed(2)}</strong>

        <button className={styles.modalSubmit} type='submit' disabled={loading}>
          {loading ? 'Finalizando...' : 'Finalizar locação'}
        </button>
      </form>
    </Modal>
  );
};

export default CompleteRentModal;
