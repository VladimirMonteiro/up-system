import styles from './styles.module.css';
import { useState } from 'react';

import { useRents } from '../../../modules/rents/hooks/useRents';
import { RentsTable } from '../../../modules/rents/components/rents/RentsTable';
import { Stats } from '../../../modules/rents/components/rents/Stats';
import { RentsHeader } from '../../../modules/rents/components/rents/RentsHeader';
import { PaymentsModal } from '../../../modules/rents/components/rents/PaymentsModal';
import { message } from 'antd';

import { paymentsService } from '../../../modules/payments/services/usePayments';

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
  } = useRents();

  /** =========================
   *  STATES - PAGAMENTOS
   ========================== */
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [registeringPayment, setRegisteringPayment] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  /** =========================
   *  HANDLERS
   ========================== */
  async function openPayments(rent) {
    try {
      setSelectedRent(rent);
      setPaymentsOpen(true);
      setLoadingPayments(true);

      const { data } = await paymentsService.findByRent(rent.id);
      setPaymentsData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPayments(false);
    }
  }

  function closePayments() {
    setPaymentsOpen(false);
    setSelectedRent(null);
    setPaymentsData(null);
  }

  async function handleRegisterPayment(data) {
    try {
      setRegisteringPayment(true);

      const payload = {
        value: data.value,
        paymentMethod: data.method,
        paymentDate: data.paymentDate.format('YYYY-MM-DD'),
        observation: data.note,
      };

      await paymentsService.create(selectedRent.id, payload);

      message.success('Pagamento registrado com sucesso!');

      await fetchRents();
      closePayments();
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message || 'Erro ao registrar pagamento. Tente novamente.',
      );
    } finally {
      setRegisteringPayment(false);
    }
  }

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
        openPayments={openPayments}
      />

      <PaymentsModal
        open={paymentsOpen}
        loading={loadingPayments || registeringPayment}
        rent={selectedRent}
        data={paymentsData}
        onClose={closePayments}
        onRegisterPayment={handleRegisterPayment}
      />
    </div>
  );
}
