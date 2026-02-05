import { useEffect, useState } from 'react';
import { rentService } from '../services/rentService';
import { message } from 'antd';

const PAGE_SIZE = 15;

export const useRents = () => {
  const [rents, setRents] = useState([]);
  const [rentStats, setRentStats] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // filtros (estado controlado, SEM efeito colateral)
  const [clientName, setClientName] = useState('');
  const [rentStatus, setRentStatus] = useState('');

  // ================= FETCH =================
  const fetchRents = async (pageNumber = page) => {
    try {
      setLoading(true);

      const response = await rentService.filter({
        clientName: clientName || null,
        rentStatus: rentStatus || null,
        page: pageNumber,
        size: PAGE_SIZE,
      });

      const data = response.data;

      setRents(data.page.content);
      setRentStats(data.stats);
      setTotalPages(data.page.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
      setRents([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BUSCA INICIAL (UMA ÚNICA VEZ)
  useEffect(() => {
    fetchRents(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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

    openContractPdf: async (rent) => {
      try {
        const response = await rentService.getContract(rent.id);
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' }),
        );
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 5000);
      } catch {
        message.error('Erro ao abrir contrato');
      }
    },

    completeRent: async (id) => {
      try {
        await rentService.complete(id);
        message.success('Locação finalizada');
        fetchRents(page);
      } catch {
        message.error('Erro ao finalizar locação');
      }
    },

    deleteRent: async (id) => {
      try {
        await rentService.delete(id);
        message.success('Locação excluída');
        fetchRents(page);
      } catch {
        message.error('Erro ao excluir locação');
      }
    },
  };
};
