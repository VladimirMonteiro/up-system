import { useState } from 'react';
import { message } from 'antd';
import { paymentsService } from '../services/paymentService';

export function usePayments(fetchRents) {
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);

  const [loadingPayments, setLoadingPayments] = useState(false);
  const [registeringPayment, setRegisteringPayment] = useState(false);

  /* =============================
     OPEN MODAL + FETCH DATA
  ============================== */
  async function openPayments(rent) {
    try {
      setSelectedRent(rent);
      setPaymentsOpen(true);
      setLoadingPayments(true);

      const { data } = await paymentsService.findByRent(rent.id);
      setPaymentsData(data);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar pagamentos');
    } finally {
      setLoadingPayments(false);
    }
  }

  /* =============================
     CLOSE MODAL
  ============================== */
  function closePayments() {
    setPaymentsOpen(false);
    setSelectedRent(null);
    setPaymentsData(null);
  }

  /* =============================
     REGISTER PAYMENT
  ============================== */
  async function registerPayment(formData) {
    try {
      setRegisteringPayment(true);

      const payload = {
        value: formData.value,
        paymentMethod: formData.method,
        paymentDate: formData.paymentDate.format('YYYY-MM-DD'),
        observation: formData.note,
      };

      await paymentsService.create(selectedRent.id, payload);

      message.success('Pagamento registrado com sucesso!');

      // Atualiza dados da modal
      await openPayments(selectedRent);

      // Atualiza tabela principal (stats, progresso etc)
      if (fetchRents) {
        await fetchRents();
      }
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message || 'Erro ao registrar pagamento. Tente novamente.',
      );
    } finally {
      setRegisteringPayment(false);
    }
  }

  /* =============================
     DELETE PAYMENT
  ============================== */
  async function deletePayment(paymentId) {
    try {
      await paymentsService.delete(paymentId);

      message.success('Pagamento excluído com sucesso');

      // Atualiza modal
      await openPayments(selectedRent);

      if (fetchRents) {
        await fetchRents();
      }
    } catch (error) {
      console.error(error);
      message.error('Erro ao excluir pagamento');
    }
  }

  return {
    paymentsOpen,
    selectedRent,
    paymentsData,
    loadingPayments,
    registeringPayment,

    openPayments,
    closePayments,
    registerPayment,
    deletePayment,
  };
}
