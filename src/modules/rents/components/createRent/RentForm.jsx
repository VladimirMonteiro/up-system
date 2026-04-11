import styles from './CreateRent.module.css';

const RentForm = ({
  client,
  tool,
  price,
  quantity,
  setQuantity,
  setPrice,
  addItem,
  openClients,
  openTools,
  handlePriceChange,
}) => {
  return (
    <form className={styles.formContainer}>
      <div className={styles.row}>
        <input disabled value={client?.name || ''} placeholder='Cliente' />
        <button type='button' onClick={openClients}>
          Selecionar
        </button>

        <input disabled value={tool?.name || ''} placeholder='Ferramenta' />
        <button type='button' onClick={openTools}>
          Selecionar
        </button>
      </div>

      <div className={styles.row}>
        <input placeholder='Valor' value={price} onChange={(e) => handlePriceChange(e, setPrice)} />
        <input
          placeholder='Quantidade'
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <button type='button' onClick={addItem}>
        Adicionar Item
      </button>
    </form>
  );
};

export default RentForm;
