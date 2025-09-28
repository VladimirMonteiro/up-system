import api from "../../utils/api";
import styles from "./SpentTable.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import ComponentMessage from "../componentMessage/ComponentMessage";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import { formateNumber } from "../../utils/formatNumber";
import Loading from "../loading/Loading";

const SpentTable = ({ selected, expenses }) => {
  const [data, setData] = useState(expenses || []);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [toolName, setToolName] = useState("");

  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  const year = new Date().getFullYear();
  const years = [year - 2, year - 1, year];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/spent");
        setData(response.data);
        setFilteredTools(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    };

    if (!expenses || expenses.length === 0) {
      fetchData();
    } else {
      setFilteredTools(expenses);
      setLoading(false);
    }
  }, [expenses]);

  const handleSearch = (e) => {
    e.preventDefault();

    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (d) => d.dateOfSpent.split("/")[2] === selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (d) => parseInt(d.dateOfSpent.split("/")[1]) === parseInt(selectedMonth)
      );
    }

    setFilteredTools(filtered);
    setSearchStatus(filtered.length === 0);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTools.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredTools.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteTool = async (id) => {
    try {
      const response = await api.delete(`spent/delete/${id}`);
      setData((prev) => prev.filter((tool) => tool.id !== id));
      setFilteredTools((prev) => prev.filter((tool) => tool.id !== id));
      setOpenModalDelete(false);
      setSuccess(response.data.message);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const handleReportSpent = (e) => {
    e.preventDefault();
    if (!selectedMonth) {
      alert("Selecione o mês.");
      return;
    }
    if (!selectedYear) {
      alert("Selecione o ano.");
      return;
    }

    let reportDataSpent = filteredTools.length ? filteredTools : data;
    navigate("/emitir-relatorio", { state: { reportDataSpent, selectedMonth, selectedYear } });
  };

  const openModal = (e, id, description) => {
    e.stopPropagation();
    setToolToDelete(id);
    setToolName(description);
    setOpenModalDelete(true);
  };

  return (
    <>
      {loading ? (
        <Loading table={true} width={"60%"} />
      ) : (
        <div className={styles.tableContainer}>
          {success && (
            <ComponentMessage
              message={success}
              type="success"
              onClose={() => setSuccess(null)}
            />
          )}

          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Pesquisar descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Ano</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Mês</option>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <button type="submit">Pesquisar</button>
          </form>

          {searchStatus ? (
            <p className={styles.noResults}>Nenhum pagamento encontrado</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  {location === "/gastos" && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={location === "/alugar" ? () => selected(row) : undefined}
                  >
                    <td>{row.id}</td>
                    <td>{row.description}</td>
                    <td>{formateNumber(row.value)}</td>
                    <td>{row.fixed ? "FIXO" : "NÃO FIXO"}</td>
                    <td>{row.dateOfSpent}</td>
                    {location === "/gastos" && (
                      <td>
                        <MdDelete
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={(e) => openModal(e, row.id, row.description)}
                        />
                        <FaPen
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={(e) => selected(e, row.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <ConfirmDeleteModal
            open={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            itemName={toolName}
            onConfirm={() => handleDeleteTool(toolToDelete)}
            remove={true}
          />

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={handlePrevious} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>
                Próxima
              </button>
            </div>
          )}

          {filteredTools.length > 0 && !searchStatus && (
            <div className={styles.totalBox}>
              <p>
                Gasto total:{" "}
                <span>
                  {formateNumber(
                    filteredTools.reduce((acc, item) => acc + (item.value || 0), 0)
                  )}
                </span>
              </p>
            </div>
          )}

          <div className={styles.reportBox}>
            <button onClick={handleReportSpent} className={styles.btnReport}>
              Gerar relatório
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SpentTable;
