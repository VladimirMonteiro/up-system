const RentsTableFilters = ({
  styles,
  filters,
  onChange,
  onSubmit,
  onClear,
}) => {
  return (
    <form className={styles.searchContainer} onSubmit={onSubmit}>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          placeholder="Cliente"
          value={filters.clientName}
          onChange={(e) => onChange('clientName', e.target.value)}
        />

        <select
          className={styles.select}
          value={filters.paymentStatus}
          onChange={(e) => onChange('paymentStatus', e.target.value)}
        >
          <option value="">Pagamento</option>
          <option value="PAID">Pago</option>
          <option value="PARTIALLY_PAID">Parcial</option>
          <option value="UNPAID">Não pago</option>
        </select>

        <select
          className={styles.select}
          value={filters.stateRent}
          onChange={(e) => onChange('stateRent', e.target.value)}
        >
          <option value="">Estado</option>
          <option value="DELIVERED">Entregue</option>
          <option value="PENDENT">Pendente</option>
        </select>

        <button className={styles.button} type="submit">
          Pesquisar
        </button>

        <button
          className={styles.buttonSecondary}
          type="button"
          onClick={onClear}
        >
          Limpar
        </button>
      </div>
    </form>
  );
};

export default RentsTableFilters;
