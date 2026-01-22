import { useEffect, useState } from 'react';
import { rentService } from '../services/rentService';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

export const useRents = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    clientName: '',
    paymentStatus: '',
    stateRent: '',
  });

  const [isFiltering, setIsFiltering] = useState(false);

  const fetchRents = async (currentPage = 0) => {
    setLoading(true);

    try {
      const response = isFiltering
        ? await rentService.filter({
            ...filters,
            page: currentPage,
            size: PAGE_SIZE,
          })
        : await rentService.findAll(currentPage, PAGE_SIZE);

      const data = response.data.content || response.data;

      setRents(data);
      setTotalPages(response.data.totalPages || 1);
      setNotFound(data.length === 0);
    } catch {
      setRents([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const generatePdf = (rent) => {
    console.log(rent);
    navigate('/pdf', {
      state: {
        rentId: rent.id,
        client: rent.client,
        items: rent.rentItems.map((i) => ({
          name: i.tool.name,
          quantity: i.quantity,
          price: i.price,
        })),
        price: rent.price,
        freight: rent.freight,
        obs: rent.obs,
        initialDate: rent.initialDate,
        deliveryDate: rent.deliveryDate,
      },
    });
  };

  useEffect(() => {
    fetchRents(page);
  }, [page, isFiltering]);

  return {
    rents,
    loading,
    notFound,
    page,
    totalPages,
    filters,

    setPage,
    setFilters,
    setIsFiltering,

    fetchRents,
    generatePdf,

    deleteRent: async (id) => {
      await rentService.delete(id);
      setRents((prev) => prev.filter((r) => r.id !== id));
    },

    completeRent: async (id) => {
      await rentService.complete(id);
      setRents((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, paymentStatus: 'PAID', stateRent: 'DELIVERED' } : r,
        ),
      );
    },
  };
};
