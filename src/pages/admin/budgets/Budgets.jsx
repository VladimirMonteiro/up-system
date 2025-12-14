import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { FaPen, FaPaste } from 'react-icons/fa';

import api from '../../../utils/api';
import Loading from '../../../components/loading/Loading';
import styles from './Budgets.module.css';
import Navbar from '../../../components/navbar/Navbar';
import ConfirmDeleteModal from '../../../components/modalConfirmDelete/ConfirmDeleteModal';
import ComponentMessage from '../../../components/componentMessage/ComponentMessage';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 14;

  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [clientName, setClientName] = useState('');
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Busca no backend
  const fetchData = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const params = {
        page: Math.max(page - 1, 0),
        size: rowsPerPage,
      };
      if (term.trim() !== '') params.search = term.trim();

      const response = await api.get('/budgets', { params });

      const content = response.data?.content ?? response.data ?? [];
      const tp =
        response.data?.totalPages ??
        Math.max(1, Math.ceil((response.data?.length ?? content.length) / rowsPerPage));

      setBudgets(Array.isArray(content) ? content : []);
      setTotalPages(tp);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar ferramentas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Primeira carga
  useEffect(() => {
    fetchData(1, '');
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value ?? 0));

  const handlePrevious = () => {
    if (currentPage > 1) fetchData(currentPage - 1, searchTerm);
  };
  const handleNext = () => {
    if (currentPage < totalPages) fetchData(currentPage + 1, searchTerm);
  };

  const openModal = (e, id, name) => {
    e.stopPropagation?.();
    e.preventDefault?.();
    setBudgetToDelete(id);
    setClientName(name);
    setOpenModalDelete(true);
  };

  const handleDeleteBudget = async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      setOpenModalDelete(false);
      setSuccess(response?.data?.message ?? 'Removido com sucesso');

      await fetchData(currentPage, searchTerm);

      if (currentPage > totalPages && totalPages > 0) {
        fetchData(Math.max(totalPages, 1), searchTerm);
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const openPdf = async (id) => {
    try {
      const response = await api.get(`/budgets/${id}`);
      const rentData = response.data;
      navigate('/orcamento-pdf', { state: rentData });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <section id={styles.container} className='mainContainerFlex'>
      <Navbar />

      {loading ? (
        <Loading />
      ) : (
        <div>
          {success && (
            <ComponentMessage message={success} type='success' onClose={() => setSuccess(null)} />
          )}
          <h1 className={styles.title}>Orcamentos</h1>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Valor Total</th>
                <th>Desconto</th>
                <th>Frete</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, idx) => (
                <tr key={idx}>
                  <td>{budget.id}</td>
                  <td>{budget.clientName}</td>
                  <td>{budget.createAt}</td>
                  <td>{formatCurrency(budget.price)}</td>
                  <td>{formatCurrency(budget.discount)}</td>
                  <td>{formatCurrency(budget.freight)}</td>
                  <td style={{ width: '10%' }}>
                    <MdDelete
                      style={{
                        color: 'red',
                        marginRight: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => openModal(e, budget.id, budget.clientName)}
                    />
                    <FaPaste style={{ marginRight: '5px' }} onClick={() => openPdf(budget.id)} />

                    {/*FaPen
                      style={{ marginRight: '5px', cursor: 'pointer' }}
                      onClick={(e) => selected(e, row.id)}/>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}

      <ConfirmDeleteModal
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        itemName={clientName}
        onConfirm={() => handleDeleteBudget(budgetToDelete)}
        remove={true}
      />
    </section>
  );
};

export default Budgets;
