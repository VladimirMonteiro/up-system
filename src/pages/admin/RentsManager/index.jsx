import styles from './styles.module.css';

import { useRents } from '../../../modules/rents/hooks/useRents';
import { RentsTable } from '../../../modules/rents/components/rents/RentsTable';
import { Stats } from '../../../modules/rents/components/rents/Stats';
import { RentsHeader } from '../../../modules/rents/components/rents/RentsHeader';

export function RentsManager() {
  const {
    // dados
    rents,
    rentStats,
    loading,
    page,
    totalPages,

    // filtros
    clientName,
    rentStatus,

    // setters
    setClientName,
    setRentStatus,
    setPage,

    // ações
    fetchRents,
    openContractPdf,
    completeRent,
    deleteRent,
  } = useRents();

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <RentsHeader
        clientName={clientName}
        rentStatus={rentStatus}
        setClientName={setClientName}
        setRentStatus={setRentStatus}
        fetchRents={fetchRents}
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
