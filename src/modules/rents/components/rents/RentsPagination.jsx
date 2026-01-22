import styles from './RentsPagination.module.css';

const RentsPagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button disabled={page === 0} onClick={() => onChange(page - 1)}>
        Anterior
      </button>

      <span>
        Página {page + 1} de {totalPages}
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
};

export default RentsPagination;
