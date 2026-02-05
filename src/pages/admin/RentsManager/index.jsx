import styles from './styles.module.css';

import { useRents } from '../../../modules/rents/hooks/useRents';
import { RentsTable } from '../../../modules/rents/components/rents/RentsTable';
import { Stats } from '../../../modules/rents/components/rents/Stats';
import { RentsHeader } from '../../../modules/rents/components/rents/RentsHeader';

export function RentsManager() {
  const {
    rents,
    rentStats,
    loading,
    page,
    totalPages,
    setPage,
    deleteRent,
    completeRent,
    openContractPdf,
    filters,
    setFilters,
    isFiltering,
    setIsFiltering,
  } = useRents();

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <RentsHeader
        filters={filters}
        setFilters={setFilters}
        isFiltering={isFiltering}
        setIsFiltering={setIsFiltering}
      />

      {/* ================= STATS ================= */}
      <Stats rentStats={rentStats} />

      {/* ================= TABLE ================= */}
      <RentsTable
        rents={rents}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        openContractPdf={openContractPdf}
        completeRent={completeRent}
        deleteRent={deleteRent}
      />
    </div>
  );
}
