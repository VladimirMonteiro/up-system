import api from '../../utils/api';
import styles from '../tableClients/Table.module.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MdDelete, MdOutlineDoneOutline } from 'react-icons/md';
import { FaPen, FaPaste } from 'react-icons/fa';

import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import { formateNumber } from '../../utils/formatNumber';
import ComponentMessage from '../componentMessage/ComponentMessage';
import Loading from '../loading/Loading';

const RentsTable = ({ selected, rents, singleClient }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);

  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalCompleteRent, setOpenModalCompleteRent] = useState(false);

  const [rentToDeleteId, setRentToDeleteId] = useState(null);
  const [rentToCompleteId, setRentToCompleteId] = useState(null);

  const [clientName, setClientName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [stateRent, setStateRent] = useState('');

  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  /* =========================
     HELPERS
  ========================== */
  const normalizeResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (response?.content) return response.content;
    return [];
  };

  /* =========================
     FETCH PADRÃO
  ========================== */
  const fetchData = async (page = 0) => {
    try {
      setLoading(true);

      if (singleClient) {
        setClient(singleClient);
        const rents = singleClient?.rents ?? [];
        setData(rents);
        setTotalPages(1);
        setNotFound(rents.length === 0);
        return;
      }

      if (rents) {
        setData(rents);
        setTotalPages(1);
        setNotFound(rents.length === 0);
        return;
      }

      const response = await api.get(`/rent?page=${page}&size=${rowsPerPage}`);
      const content = normalizeResponse(response.data);

      setData(content);
      setTotalPages(response.data?.totalPages ?? 1);
      setNotFound(content.length === 0);
    } catch (error) {
      console.error(error);
      setNotFound(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH COM FILTRO
  ========================== */
  const fetchFilteredData = async (page = 0) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        size: rowsPerPage,
        clientName: clientName || '',
        paymentStatus: paymentStatus || '',
        stateRent: stateRent || '',
      });

      const response = await api.get(`/rent/filter?${params}`);
      const content = normalizeResponse(response.data);

      setData(content);
      setTotalPages(response.data?.totalPages ?? 1);
      setNotFound(content.length === 0);
    } catch (error) {
      console.error('Erro ao filtrar:', error);
      setData([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECT
  ========================== */
  useEffect(() => {
    if (isFiltering) {
      fetchFilteredData(currentPage);
    } else {
      fetchData(currentPage);
    }
  }, [currentPage, rents, singleClient]);

  /* =========================
     FILTROS
  ========================== */
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsFiltering(true);
    setCurrentPage(0);
    fetchFilteredData(0);
  };

  const clearFilters = () => {
    setClientName('');
    setPaymentStatus('');
    setStateRent('');
    setIsFiltering(false);
    setCurrentPage(0);
    fetchData(0);
  };

  /* =========================
     PAGINAÇÃO
  ========================== */
  const handlePrevious = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  /* =========================
     AÇÕES
  ========================== */
  const handleDeleteRent = async (id) => {
    try {
      const response = await api.delete(`/rent/delete/${id}`);
      setSuccess(response.data?.message ?? 'Locação removida');
      setData((prev) => prev.filter((r) => r.id !== id));
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const completeRent = async (id) => {
    try {
      await api.put(`/rent/completed/${id}`);
      setData((prev) =>
        prev.map((rent) =>
          rent.id === id ? { ...rent, paymentStatus: 'PAID', stateRent: 'DELIVERED' } : rent,
        ),
      );
      setOpenModalCompleteRent(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openPdf = (rent) => {
    const items = rent.rentItems.map((item) => ({
      ...item,
      name: item.tool.name,
      tool: undefined,
    }));

    navigate('/pdf', {
      state: {
        client: singleClient || rent.client,
        items,
        price: rent.price,
        initialDate: rent.initialDate,
        deliveryDate: rent.deliveryDate,
        freight: rent.freight,
        obs: rent.obs,
      },
    });
  };

  const getPaymentStatus = (status) => {
    if (status === 'PAID') return 'PAGO';
    if (status === 'PARTIALLY_PAID') return 'PARCIAL';
    return 'NÃO PAGO';
  };

  /* =========================
     RENDER
  ========================== */
  if (loading) return <Loading table />;

  return (
  <div className={styles.tableContainer}>
    {success && (
      <ComponentMessage
        message={success}
        type="success"
        onClose={() => setSuccess(null)}
      />
    )}

    {/* FILTRO */}
    <form className={styles.searchContainer} onSubmit={handleFilterSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Digite para buscar..."
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className={styles.input}
        />

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">Status de Pagamento</option>
          <option value="PAID">Pago</option>
          <option value="PARTIALLY_PAID">Parcialmente pago</option>
          <option value="UNPAID">Não pago</option>
        </select>

        <select
          value={stateRent}
          onChange={(e) => setStateRent(e.target.value)}
          className={styles.select}
        >
          <option value="">Estado do Aluguel</option>
          <option value="DELIVERED">Entregue</option>
          <option value="PENDENT">Pendente</option>
        </select>

        <button type="submit" className={styles.button}>
          Pesquisar
        </button>

        {isFiltering && (
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={clearFilters}
          >
            Limpar
          </button>
        )}
      </div>
    </form>

    {/* TABELA */}
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
            <td colSpan="8" className={styles.messageNotFound}>
              Nenhuma locação encontrada
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.client?.name || client?.name}</td>
              <td>{row.initialDate}</td>
              <td>{row.deliveryDate}</td>
              <td>{formateNumber(row.price)}</td>

              <td>
                <span
                  className={`${styles.tableRow} ${
                    row.paymentStatus === "PAID"
                      ? styles.rowPaid
                      : row.paymentStatus === "PARTIALLY_PAID"
                      ? styles.rowNear
                      : styles.rowOverdue
                  }`}
                >
                  {getPaymentStatus(row.paymentStatus)}
                </span>
              </td>

              <td>
                <span
                  className={`${styles.tableRow} ${
                    row.stateRent === "DELIVERED"
                      ? styles.rowPaid
                      : styles.rowOverdue
                  }`}
                >
                  {row.stateRent === "DELIVERED" ? "ENTREGUE" : "PENDENTE"}
                </span>
              </td>

              <td className={styles.actions}>
                <MdDelete
                  color="red"
                  onClick={() => {
                    setRentToDeleteId(row.id);
                    setClientName(row.client?.name);
                    setOpenModal(true);
                  }}
                />

                <FaPen onClick={(e) => selected(e, row.id)} />

                <FaPaste onClick={() => openPdf(row)} />

                <MdOutlineDoneOutline
                  color="green"
                  onClick={() => {
                    setRentToCompleteId(row.id);
                    setOpenModalCompleteRent(true);
                  }}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* PAGINAÇÃO */}
    <div className={styles.pagination}>
      <button onClick={handlePrevious} disabled={currentPage === 0}>
        Anterior
      </button>

      <span>
        Página {currentPage + 1} de {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage + 1 >= totalPages}
      >
        Próxima
      </button>
    </div>

    {/* MODAIS */}
    <ConfirmDeleteModal
      open={openModal}
      itemName={clientName}
      onClose={() => setOpenModal(false)}
      onConfirm={() => handleDeleteRent(rentToDeleteId)}
      remove
    />

    <ConfirmDeleteModal
      open={openModalCompleteRent}
      itemName={clientName}
      onClose={() => setOpenModalCompleteRent(false)}
      onConfirm={() => completeRent(rentToCompleteId)}
    />
  </div>
);

};

export default RentsTable;
