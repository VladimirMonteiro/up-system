import { useEffect, useState } from 'react';
import { rentService } from '../services/rentService';
import { message } from 'antd';

const PAGE_SIZE = 15;

export const useRents = () => {
  const [rents, setRents] = useState([]);
  const [rentStats, setRentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    clientName: '',
    rentStatus: '', // ACTIVE | FINISHED | OVERDUE
  });

  const [isFiltering, setIsFiltering] = useState(false);

  // ================= FETCH RENTS =================
  const fetchRents = async (currentPage = 0) => {
    setLoading(true);
    try {
      const response = isFiltering
        ? await rentService.filter({
            clientName: filters.clientName || null,
            rentStatus: filters.rentStatus || null,
            page: currentPage,
            size: PAGE_SIZE,
          })
        : await rentService.findAll(currentPage, PAGE_SIZE);

      const data = response.data;

      setRents(data.page.content);
      setRentStats(data.stats);
      setTotalPages(data.page.totalPages || 1);
      setNotFound(data.page.content.length === 0);
    } catch (error) {
      console.error(error);
      setRents([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN PDF =================
  const openContractPdf = async (rent) => {
    try {
      const response = await rentService.getContract(rent.id);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );

      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error(error);
      message.error('Erro ao abrir contrato');
      throw error; // importante para o loading externo funcionar
    }
  };
  // ================= CRUD =================
  const deleteRent = async (id) => {
    try {
      await rentService.delete(id);
      message.success('Locação excluída com sucesso');
      fetchRents(page);
    } catch {
      message.error('Erro ao excluir locação');
    }
  };

  const completeRent = async (id) => {
    try {
      await rentService.complete(id);
      message.success('Locação finalizada com sucesso');
      fetchRents(page);
    } catch {
      message.error('Locação já finalizada ou não encontrada.');
    }
  };

  useEffect(() => {
    fetchRents(page);
  }, [page, isFiltering]);

  return {
    rents,
    rentStats,
    loading,
    notFound,
    page,
    totalPages,
    filters,

    setPage,
    setFilters,
    setIsFiltering,

    fetchRents,
    openContractPdf,
    deleteRent,
    completeRent,
  };
};
