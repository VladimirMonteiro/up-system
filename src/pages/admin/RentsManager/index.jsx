import styles from './styles.module.css';

import { useRents } from '../../../modules/rents/hooks/useRents';
import { RentsTable } from '../../../modules/rents/components/rents/RentsTable';
import { Stats } from '../../../modules/rents/components/rents/Stats';
import { RentsHeader } from '../../../modules/rents/components/rents/RentsHeader';
import { PaymentsModal } from '../../../modules/rents/components/rents/PaymentsModal';
import { usePayments } from '../../../modules/payments/hooks/usePayments';

export function RentsManager() {
  const {
    rents,
    rentStats,
    loading,
    page,
    totalPages,
    clientName,
    rentStatus,
    setClientName,
    setRentStatus,
    setPage,
    fetchRents,
    openContractPdf,
    completeRent,
    deleteRent,
    deletePayment,
  } = useRents();

  const paymentsCtrl = usePayments(fetchRents);

  /** =========================
   *  RENDER
   ========================== */
  return (
    <div className={styles.page}>
      <RentsHeader
        clientName={clientName}
        rentStatus={rentStatus}
        setClientName={setClientName}
        setRentStatus={setRentStatus}
        fetchRents={fetchRents}
      />

      <Stats rentStats={rentStats} />

      <RentsTable
        rents={rents}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        openContractPdf={openContractPdf}
        completeRent={completeRent}
        deleteRent={deleteRent}
        openPayments={paymentsCtrl.openPayments}
      />
      <PaymentsModal
        open={paymentsCtrl.paymentsOpen}
        onClose={paymentsCtrl.closePayments}
        rent={paymentsCtrl.selectedRent}
        data={paymentsCtrl.paymentsData}
        loading={paymentsCtrl.registeringPayment}
        onRegisterPayment={paymentsCtrl.registerPayment}
        onDeletePayment={paymentsCtrl.deletePayment}
      />
    </div>
  );
}
