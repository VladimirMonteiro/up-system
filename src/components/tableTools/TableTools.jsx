import api from '../../utils/api';
import styles from '../tableClients/Table.module.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import { formateNumber } from '../../utils/formatNumber';
import Loading from '../loading/Loading';
import ComponentMessage from '../componentMessage/ComponentMessage';

const rowsPerPage = 13;

const TableTools = ({ selected, isOpen }) => {
  /* =======================
        STATES
     ======================= */
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingTable, setLoadingTable] = useState(true);
  const [success, setSuccess] = useState(null);

  // Delete
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [toolName, setToolName] = useState('');

  /* =======================
        ROUTER
     ======================= */
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isToolsRoute = pathname === '/ferramentas' || pathname.startsWith('/ferramentas/');

  /* =======================
        REFS
     ======================= */
  const searchInputRef = useRef(null);

  /* =======================
        FOCUS NO INPUT
     ======================= */
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
        searchInputRef.current.select?.();
      }, 100);
    }
  }, [isOpen]);

  /* =======================
        BUSCA SEM FILTRO
     ======================= */
  const fetchTools = async (page = 0) => {
    try {
      setLoadingTable(true);

      const response = await api.get('/tools', {
        params: {
          page,
          size: rowsPerPage,
        },
      });

      setData(response.data || { content: [], totalPages: 0 });
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar ferramentas:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  /* =======================
        BUSCA COM FILTRO
     ======================= */
  const searchTools = async (page = 0) => {
    try {
      setLoadingTable(true);

      const response = await api.get('/tools/search', {
        params: {
          name: searchTerm,
          page,
          size: rowsPerPage,
        },
      });

      setData(response.data || { content: [], totalPages: 0 });
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar ferramentas:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  /* =======================
        LOAD INICIAL
     ======================= */
  useEffect(() => {
    fetchTools(0);
  }, []);

  const tools = data.content || [];

  /* =======================
        PAGINAÇÃO
     ======================= */
  const handlePrevious = () => {
    const newPage = Math.max(currentPage - 1, 0);
    searchTerm.trim() ? searchTools(newPage) : fetchTools(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(currentPage + 1, data.totalPages - 1);
    searchTerm.trim() ? searchTools(newPage) : fetchTools(newPage);
  };

  /* =======================
        DELETE
     ======================= */
  const openModal = (e, id, name) => {
    e.stopPropagation();
    setToolToDelete(id);
    setToolName(name);
    setOpenModalDelete(true);
  };

  const handleDeleteTool = async () => {
    try {
      const response = await api.delete(`/tools/delete/${toolToDelete}`);

      setSuccess(response.data?.message || 'Ferramenta removida');
      setOpenModalDelete(false);

      // Atualiza lista após delete
      searchTerm.trim() ? searchTools(currentPage) : fetchTools(currentPage);
    } catch (error) {
      console.error('Erro ao deletar ferramenta:', error);
    }
  };

  /* =======================
        SUBMIT BUSCA
     ======================= */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchTerm.trim() ? searchTools(0) : fetchTools(0);
  };

  /* =======================
        RENDER
     ======================= */
  if (loadingTable) return <Loading table />;

  return (
    <div className={styles.tableContainer}>
      {success && (
        <ComponentMessage type='success' message={success} onClose={() => setSuccess(null)} />
      )}

      {/* BUSCA */}
      <form className={styles.inputGroup} onSubmit={handleSearchSubmit}>
        <input
          ref={searchInputRef}
          type='text'
          placeholder='Buscar ferramenta...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button}>Pesquisar</button>
      </form>

      {/* TABELA */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Total</th>
            <th>Disponível</th>
            <th>Diária</th>
            <th>Semanal</th>
            <th>Quinzena</th>
            <th>3 semanas</th>
            <th>Mensal</th>
            {isToolsRoute && <th>Ações</th>}
          </tr>
        </thead>

        <tbody>
          {tools.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center' }}>
                Nenhuma ferramenta encontrada
              </td>
            </tr>
          ) : (
            tools.map((tool) => (
              <tr key={tool.id} onClick={() => selected?.(tool)}>
                <td>{tool.id}</td>
                <td>{tool.name}</td>
                <td>{tool.totalQuantity}un</td>
                <td>{tool.quantity}un</td>
                <td>{formateNumber(tool.daily)}</td>
                <td>{formateNumber(tool.week)}</td>
                <td>{formateNumber(tool.biweekly)}</td>
                <td>{formateNumber(tool.twentyOneDays)}</td>
                
                <td>{formateNumber(tool.priceMonth)}</td>
                {isToolsRoute && (
                  <td>
                    <MdDelete
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={(e) => openModal(e, tool.id, tool.name)}
                    />
                    <GrView
                      style={{ marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => navigate(`/ferramentas/${tool.id}`)}
                    />
                    <FaPen
                      style={{ marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => selected(tool)}
                    />
                  </td>
                )}
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
          Página {currentPage + 1} de {data.totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage + 1 >= data.totalPages}>
          Próxima
        </button>
      </div>

      {/* MODAL DELETE */}
      <ConfirmDeleteModal
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        itemName={toolName}
        onConfirm={handleDeleteTool}
        remove
      />
    </div>
  );
};

export default TableTools;
