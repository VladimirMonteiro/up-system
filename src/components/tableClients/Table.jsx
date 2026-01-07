import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './Table.module.css';
import api from '../../utils/api';

// Ícones
import { MdDelete } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';

// Router
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes auxiliares
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import ComponentMessage from '../componentMessage/ComponentMessage';
import Loading from '../loading/Loading';

// Quantidade fixa de linhas por página
const rowsPerPage = 13;

/**
 * Tabela de clientes
 * - Lista clientes com paginação
 * - Permite busca manual (submit)
 * - Mostra ações somente na rota /clientes
 * - Exponibiliza métodos imperativos via ref
 */
const Table = forwardRef(({ selected, loading, setLoadingClients, isOpen }, ref) => {
  /* =======================
       STATES
    ======================== */

  // Dados da tabela (padrão Spring Page)
  const [data, setData] = useState({ content: [], totalPages: 0 });

  // Termo digitado no input de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Mensagem de sucesso (delete)
  const [success, setSuccess] = useState(null);

  // Página atual
  const [currentPage, setCurrentPage] = useState(0);

  // Modal de confirmação de delete
  const [openModalDelete, setOpenModalDelete] = useState(false);

  // Loading específico da tabela
  const [loadingTable, setLoadingTable] = useState(true);

  // Cliente selecionado para exclusão
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientName, setClientName] = useState('');

  /* =======================
       ROUTER
    ======================== */

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Verifica se estamos na rota /clientes ou subrotas
  const isClientesRoute = pathname === '/clientes' || pathname.startsWith('/clientes/');

  /* =======================
       REFS
    ======================== */

  // Referência do input de busca
  const searchInputRef = useRef(null);

  /* =======================
       MÉTODOS IMPERATIVOS
       (expostos ao componente pai)
    ======================== */

  useImperativeHandle(ref, () => ({
    // Foca e seleciona o texto do input
    focus: () => focusInputOnce(),
    // Limpa a busca
    clearSearch: () => setSearchTerm(''),
  }));

  const focusInputOnce = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select?.();
      return true;
    }
    return false;
  };

  /* =======================
       FOCUS AUTOMÁTICO
       (quando modal abre)
    ======================== */

  useEffect(() => {
    if (!isOpen) return;

    let attempts = 0;
    const maxAttempts = 20;

    const timer = setInterval(() => {
      attempts++;
      if (!loadingTable && searchInputRef.current) {
        focusInputOnce();
        clearInterval(timer);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [isOpen, loadingTable]);

  /* =======================
       BUSCA SEM FILTRO
    ======================== */

  const fetchClients = useCallback(
    async (page = currentPage) => {
      try {
        setLoadingTable(true);

        const response = await api.get(`/clients?page=${page}&size=${rowsPerPage}`);

        setData(response.data || { content: [], totalPages: 0 });
        setCurrentPage(page);
        setLoadingClients(false);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoadingTable(false);
      }
    },
    [currentPage, setLoadingClients],
  );

  /* =======================
       BUSCA COM FILTRO
    ======================== */

  const searchClients = async (page = 0) => {
    try {
      setLoadingTable(true);

      const response = await api.get(
        `/clients/search?name=${encodeURIComponent(searchTerm)}&page=${page}&size=${rowsPerPage}`,
      );

      setData(response.data || { content: [], totalPages: 0 });
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  /* =======================
       LOAD INICIAL
    ======================== */

  useEffect(() => {
    fetchClients(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clients = data.content || [];

  /* =======================
       PAGINAÇÃO
    ======================== */

  const handlePrevious = () => {
    const newPage = Math.max(currentPage - 1, 0);
    searchTerm.trim() ? searchClients(newPage) : fetchClients(newPage);
    window.scrollTo({ top: 0 });
  };

  const handleNext = () => {
    const newPage = Math.min(currentPage + 1, Math.max(data.totalPages - 1, 0));
    searchTerm.trim() ? searchClients(newPage) : fetchClients(newPage);
    window.scrollTo({ top: 0 });
  };

  /* =======================
       DELETE
    ======================== */

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/clients/delete/${id}`);

      setData((prev) => ({
        ...prev,
        content: prev.content.filter((c) => c.id !== id),
      }));

      setOpenModalDelete(false);
      setSuccess(response.data.message);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const openModalClient = (e, id, name) => {
    e.stopPropagation();
    setClientToDelete(id);
    setClientName(name);
    setOpenModalDelete(true);
  };

  /* =======================
       SUBMIT DA BUSCA
    ======================== */

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchTerm.trim() ? searchClients(0) : fetchClients(0);
  };

  const rowSelectable = ["/alugar", "/criar-orcamento"].some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  /* =======================
       RENDER
    ======================== */

  return (
    <>
      {loading || loadingTable ? (
        <Loading table />
      ) : (
        <div className={styles.tableContainer}>
          {success && (
            <ComponentMessage message={success} type='success' onClose={() => setSuccess(null)} />
          )}

          {/* BUSCA */}
          <form className={styles.inputGroup} onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Digite para buscar...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
              autoComplete='off'
            />
            <button type='submit' className={styles.button}>
              Pesquisar
            </button>
          </form>

          {/* TABELA */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Cidade</th>
                <th>Bairro</th>
                <th>CEP</th>
                {isClientesRoute && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {clients.map((row) => {
                const phone = row.phones?.[0] || '-';
                const addr = row.addresses?.[0];

                return (
                  <tr key={row.id} onClick={
                      rowSelectable ? () => selected(row) : undefined
                    }>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.cpf || row.cnpj || '-'}</td>
                    <td>{phone}</td>
                    <td>{addr ? `${addr.street} - ${addr.number}` : '-'}</td>
                    <td>{addr?.city || '-'}</td>
                    <td>{addr?.neighborhood || '-'}</td>
                    <td>{addr?.cep || '-'}</td>

                    {isClientesRoute && (
                      <td style={{ padding: '5px' }}>
                        <FaPen
                          style={{ marginRight: '5px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            selected(e, row.id);
                          }}
                        />
                        <GrView
                          style={{ marginRight: '5px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clientes/${row.id}`);
                          }}
                        />
                        <MdDelete
                          style={{ color: 'red' }}
                          onClick={(e) => openModalClient(e, row.id, row.name)}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* MODAL DELETE */}
          <ConfirmDeleteModal
            open={openModalDelete}
            itemName={clientName}
            onClose={() => setOpenModalDelete(false)}
            onConfirm={() => handleDelete(clientToDelete)}
            remove
          />

          {/* PAGINAÇÃO */}
          <div className={styles.pagination}>
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              Anterior
            </button>
            <span>
              Página {currentPage + 1} de {data.totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === data.totalPages - 1}>
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default Table;
