import api from "../../utils/api";
import styles from "../tableClients/Table.module.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import { formateNumber } from "../../utils/formatNumber";
import Loading from "../loading/Loading";
import ComponentMessage from "../componentMessage/ComponentMessage";

const TableTools = ({ selected, isOpen }) => {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 13;

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [toolName, setToolName] = useState("");

  const searchInputRef = useRef(null);

  // Foco no input quando abrir a pesquisa
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            searchInputRef.current.focus();
            searchInputRef.current.select?.();
          } catch (_) {}
        }, 50);
      });
    }
  }, [isOpen]);

  // Busca no backend
  const fetchData = async (page = 1, term = "") => {
    setLoadingTable(true);
    try {
      const params = {
        page: Math.max(page - 1, 0),
        size: rowsPerPage,
      };
      if (term.trim() !== "") params.search = term.trim();

      const response = await api.get("tools", { params });

      const content = response.data?.content ?? response.data ?? [];
      const tp =
        response.data?.totalPages ??
        Math.max(
          1,
          Math.ceil((response.data?.length ?? content.length) / rowsPerPage)
        );

      setData(Array.isArray(content) ? content : []);
      setTotalPages(tp);
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao buscar ferramentas:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  // Primeira carga
  useEffect(() => {
    fetchData(1, "");
  }, []);

  // Paginação
  const handlePrevious = () => {
    if (currentPage > 1) fetchData(currentPage - 1, searchTerm);
  };
  const handleNext = () => {
    if (currentPage < totalPages) fetchData(currentPage + 1, searchTerm);
  };

  // Modal delete
  const openModal = (e, id, name) => {
    e.stopPropagation?.();
    e.preventDefault?.();
    setToolToDelete(id);
    setToolName(name);
    setOpenModalDelete(true);
  };

  const handleDeleteTool = async (id) => {
    try {
      const response = await api.delete(`tools/delete/${id}`);
      setOpenModalDelete(false);
      setSuccess(response?.data?.message ?? "Removido com sucesso");

      await fetchData(currentPage, searchTerm);

      if (currentPage > totalPages && totalPages > 0) {
        fetchData(Math.max(totalPages, 1), searchTerm);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // Pesquisa
  const onSubmitSearch = (e) => {
    e.preventDefault();
    fetchData(1, searchTerm);
  };

  // 🔥 Corrigido: caminhos permitidos para selecionar linha
  const rowSelectable = ["/alugar", "/criar-orcamento"].some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  return (
    <>
      {loadingTable ? (
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

          <form className={styles.inputGroup} onSubmit={onSubmitSearch}>
            <input
              ref={searchInputRef}
              type="text"
              id="search"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
              autoComplete="off"
              tabIndex={0}
            />
            <input type="submit" value="Pesquisar" className={styles.button} />
          </form>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Quantidade total</th>
                <th>Quantidade disponível</th>
                <th>Diária</th>
                <th>Semanal</th>
                <th>Quinzena</th>
                <th>3 semanas</th>
                <th>Mensal</th>
                {pathname === "/ferramentas" && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={pathname === "/ferramentas" ? 10 : 9}
                    style={{ textAlign: "center" }}
                  >
                    Nenhuma ferramenta encontrada.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    onClick={rowSelectable ? () => selected(row) : undefined}
                    style={
                      row.quantity === 0 ? { backgroundColor: "#ffcccc" } : {}
                    }
                  >
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.totalQuantity}un</td>
                    <td>{row.quantity}un</td>
                    <td>{formateNumber(row.daily)}</td>
                    <td>{formateNumber(row.week)}</td>
                    <td>{formateNumber(row.biweekly)}</td>
                    <td>{formateNumber(row.twentyOneDays)}</td>
                    <td>{formateNumber(row.priceMonth)}</td>

                    {pathname === "/ferramentas" && (
                      <td style={{ width: "10%" }}>
                        <MdDelete
                          style={{
                            color: "red",
                            marginRight: "5px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => openModal(e, row.id, row.name)}
                        />
                        <GrView
                          style={{ marginRight: "5px", cursor: "pointer" }}
                          onClick={() => navigate(`/ferramentas/${row.id}`)}
                        />
                        <FaPen
                          style={{ marginRight: "5px", cursor: "pointer" }}
                          onClick={(e) => selected(e, row.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Modal de confirmação */}
          <ConfirmDeleteModal
            open={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            itemName={toolName}
            onConfirm={() => handleDeleteTool(toolToDelete)}
            remove={true}
          />

          {/* Paginação */}
          <div className={styles.pagination}>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableTools;
