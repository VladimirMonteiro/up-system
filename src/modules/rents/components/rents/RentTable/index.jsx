import Loading from '../../../../../components/loading/Loading';
import RentsTableRow from './RentsTableRow';
import RentsTableFilters from './RentsTableFilters';
import RentsPagination from '../RentsPagination';
import styles from './RentsTable.module.css';

const RentsTable = ({
  rents,
  loading,
  notFound,
  filters,
  page,
  totalPages,
  onPageChange,
  onFilterChange,
  onFilterSubmit,
  onFilterClear,
  onDelete,
  onComplete,
  onPdf,
  onEdit,
}) => {
  if (loading) return <Loading table />;

  return (
    <div className={styles.tableContainer}>
      <RentsTableFilters
        styles={styles}
        filters={filters}
        onChange={onFilterChange}
        onSubmit={onFilterSubmit}
        onClear={onFilterClear}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Início</th>
            <th>Entrega</th>
            <th>Valor</th>
            <th>Pagamento</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {notFound ? (
            <tr>
              <td colSpan='8' className={styles.messageNotFound}>
                Nenhuma locação encontrada
              </td>
            </tr>
          ) : (
            rents.map((rent) => (
              <RentsTableRow
                key={rent.id}
                rent={rent}
                styles={styles}
                onDelete={onDelete}
                onComplete={onComplete}
                onPdf={onPdf}
                onEdit={onEdit}
              />
            ))
          )}
        </tbody>
      </table>

      <RentsPagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  );
};

export default RentsTable;
