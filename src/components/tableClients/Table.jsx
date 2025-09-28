import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./Table.module.css";
import api from "../../utils/api";

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { GrView } from "react-icons/gr";

import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import ComponentMessage from "../componentMessage/ComponentMessage";
import Loading from "../loading/Loading";

const rowsPerPage = 13;

const Table = forwardRef(({ selected, loading, setLoadingClients, isOpen }, ref) => {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientName, setClientName] = useState("");

  const location = useLocation().pathname;
  const navigate = useNavigate();

  const searchInputRef = useRef(null);

  // expõe métodos imperativos para o pai (opcional)
  useImperativeHandle(ref, () => ({
    focus: () => focusInputOnce(),
    clearSearch: () => setSearchTerm(""),
  }));

  // função que foca o input (segura)
  const focusInputOnce = () => {
    try {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select?.();
        return true;
      }
    } catch (err) {
      // ignore
    }
    return false;
  };

  // Ao abrir o modal, tentamos focar no input. Mas só quando a tabela já terminou de carregar.
  // Fazemos polling com um interval e máximo de tentativas para garantir foco em portais / focus-traps.
  useEffect(() => {
    if (!isOpen) return;

    let attempts = 0;
    const maxAttempts = 20; // 20 * 80ms ≈ 1600ms máximo de espera
    const intervalMs = 80;

    const timer = setInterval(() => {
      attempts++;
      // somente foca quando a tabela já não está em loading e o input existe
      if (!loadingTable && searchInputRef.current) {
        focusInputOnce();
        clearInterval(timer);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer); // evita loop infinito
      }
    }, intervalMs);

    // cleanup
    return () => clearInterval(timer);
  }, [isOpen, loadingTable]);

  // busca geral (sem filtro) / paginada
  const fetchClients = useCallback(
    async (page = currentPage) => {
      try {
        setLoadingTable(true);
        const response = await api.get(`/clients?page=${page}&size=${rowsPerPage}`);
        setData(response.data || { content: [], totalPages: 0 });
        setLoadingClients(false);
        setCurrentPage(page);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoadingTable(false);
      }
    },
    [currentPage, setLoadingClients]
  );

  // busca com filtro (quando usuário submeter a pesquisa)
  const searchClients = async (page = 0) => {
    try {
      setLoadingTable(true);
      const url = `/clients/search?name=${encodeURIComponent(searchTerm)}&page=${page}&size=${rowsPerPage}`;
      const response = await api.get(url);
      setData(response.data || { content: [], totalPages: 0 });
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao buscar (search) clientes:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  // carregar lista inicial (somente no mount)
  useEffect(() => {
    fetchClients(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // só uma vez

  const clients = data.content || [];

  const handlePrevious = () => {
    const newPage = Math.max(currentPage - 1, 0);
    if (searchTerm.trim()) {
      searchClients(newPage);
    } else {
      fetchClients(newPage);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleNext = () => {
    const newPage = Math.min(currentPage + 1, Math.max(data.totalPages - 1, 0));
    if (searchTerm.trim()) {
      searchClients(newPage);
    } else {
      fetchClients(newPage);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`clients/delete/${id}`);
      setData((prev) => ({
        ...prev,
        content: prev.content.filter((c) => c.id !== id),
      }));
      setOpenModalDelete(false);
      setSuccess(response.data.message);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const openModalClient = (e, id, name) => {
    e.preventDefault();
    setClientToDelete(id);
    setClientName(name);
    setOpenModalDelete(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // se vazio, volta pra listagem normal
    if (!searchTerm.trim()) {
      fetchClients(0);
    } else {
      searchClients(0);
    }
  };

  return (
    <>
      {loading || loadingTable ? (
        <Loading table={true} />
      ) : (
        <div className={styles.tableContainer}>
          {success && (
            <ComponentMessage
              message={success}
              type="success"
              onClose={() => setSuccess(null)}
            />
          )}

          {/* formulário de pesquisa - submeter (enter ou botão) dispara chamada ao backend */}
          <form className={styles.inputGroup} onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="text"
              id="search"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // não disparar busca automática aqui (só no submit)
              }}
              className={styles.input}
              autoComplete="off"
            />
            <button type="submit" className={styles.button}>
              Pesquisar
            </button>
          </form>

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
                {location === "/clientes" && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {clients.map((row) => {
                const phone = row.phones?.[0] || "-";
                const addr = row.addresses?.[0];
                return (
                  <tr
                    key={row.id}
                    onClick={
                      location === "/alugar" ? () => selected(row) : undefined
                    }
                  >
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.cpf || row.cnpj || "-"}</td>
                    <td>{phone}</td>
                    <td>{addr ? `${addr.street} - ${addr.number}` : "-"}</td>
                    <td>{addr?.city || "-"}</td>
                    <td>{addr?.neighborhood || "-"}</td>
                    <td>{addr?.cep || "-"}</td>

                    {location === "/clientes" && (
                      <td style={{ padding: "5px" }}>
                        <FaPen
                          style={{ marginRight: "5px" }}
                          onClick={(e) => selected(e, row.id)}
                        />
                        <GrView
                          style={{ marginRight: "5px" }}
                          onClick={() => navigate(`/clientes/${row.id}`)}
                        />
                        <MdDelete
                          style={{ color: "red" }}
                          onClick={(e) => openModalClient(e, row.id, row.name)}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ConfirmDeleteModal
            open={openModalDelete}
            itemName={clientName}
            onClose={() => setOpenModalDelete(false)}
            onConfirm={() => handleDelete(clientToDelete)}
            remove={true}
          />

          <div className={styles.pagination}>
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              Anterior
            </button>
            <span>
              Página {currentPage + 1} de {data.totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === data.totalPages - 1}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default Table;
