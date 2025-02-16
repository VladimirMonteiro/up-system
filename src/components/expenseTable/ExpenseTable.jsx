import api from '../../utils/api';
import styles from '../tableClients/Table.module.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import ComponentMessage from '../componentMessage/ComponentMessage';
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import { formateNumber } from '../../utils/formatNumber';
import Loading from '../loading/Loading';

const SpentTable = ({ selected, expenses }) => {
    const [data, setData] = useState(expenses || []);  // Certifique-se de inicializar com um array vazio
    const [searchTerm, setSearchTerm] = useState('');
    const [searchStatus, setSearchStatus] = useState(false); // Controle para mostrar "Nenhum pagamento encontrado"
    const [filteredTools, setFilteredTools] = useState([]);
    const [success, setSuccess] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 10;
    const location = useLocation().pathname;
    const navigate = useNavigate();

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [toolToDelete, setToolToDelete] = useState(null);
    const [toolName, setToolName] = useState('');

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const year = new Date().getFullYear();
    const years = [year - 2, year - 1, year];

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/spent");
                setData(response.data);
                setFilteredTools(response.data);  // Inicializando com todos os dados
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setLoading(false);  // Certifique-se de parar o loading
            }
        };
        if (!expenses || expenses.length === 0) {
            fetchData();  // Somente faz a requisição se não houver dados iniciais
        } else {
            setFilteredTools(expenses);  // Usa os dados passados via props
            setLoading(false);
        }
    }, [expenses]);  // Dependência de expenses

    const openModal = (e, id, name) => {
        e.preventDefault();
        setToolToDelete(id);
        setToolName(name);
        setOpenModalDelete(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        let filteredData = data;

        // Filtro por nome da descrição
        if (searchTerm) {
            filteredData = filteredData.filter((data) =>
                data.description.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
        }

        // Filtro por ano selecionado
        if (selectedYear) {
            filteredData = filteredData.filter((data) =>
                data.dateOfSpent.split("/")[2] === selectedYear
            );
        }

        // Filtro por mês selecionado
        if (selectedMonth) {
            filteredData = filteredData.filter((data) =>
                parseInt(data.dateOfSpent.split("/")[1]) === parseInt(selectedMonth)
            );
        }

        setFilteredTools(filteredData);
        setSearchStatus(filteredData.length === 0);  // Se não houver resultados, ativar status
        setCurrentPage(1);  // Reinicia a página
    };

    const totalPages = Math.ceil(filteredTools.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = filteredTools.slice(startIndex, startIndex + rowsPerPage);

    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const handleDeleteTool = async (id) => {
        try {
            const response = await api.delete(`spent/delete/${id}`);
            console.log(response.data);
            setData((prevData) => prevData.filter((tool) => tool.id !== id));
            setFilteredTools((prevData) => prevData.filter((tool) => tool.id !== id));  // Atualiza após remoção
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
        console.log(data)

        navigate("/emitir-relatorio", { state: { reportDataSpent, selectedMonth, selectedYear } });
    };

    return (
        <>
            {loading ? <Loading table={true} width={"45%"} /> : (
                <div className={styles.tableContainer} style={{ width: "55%" }}>
                    {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
                    <form className={styles.searchContainer} onSubmit={handleSearch}>
                        <label htmlFor="search">Pesquisar</label>
                        <input style={{ margin: "10px" }}
                            type="text"
                            id="search"
                            placeholder="Digite para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select style={{ margin: "10px" }}
                            name="year"
                            id="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">Ano</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select style={{ margin: "10px" }}
                            name="month"
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">Mês</option>
                            {months.map((month, key) => (
                                <option key={key} value={key + 1}>{month}</option>
                            ))}
                        </select>
                        <input type="submit" value="Pesquisar" />
                    </form>

                    {searchStatus && (
                        <p style={{ textAlign: "center", margin: "20px 0", color: "red" }}>
                            Nenhum pagamento encontrado
                        </p>
                    )}

                    {!searchStatus && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Tipo</th>
                                    <th>Data de pagamento</th>
                                    {location === "/gastos" && <th>Ações</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={location === "/alugar" ? () => selected(row) : undefined}
                                        style={row.fixed === true ? { backgroundColor: '#ffccc' } : {}}
                                    >
                                        <td>{row.id}</td>
                                        <td>{row.description}</td>
                                        <td>{formateNumber(row.value)}</td>
                                        <td>{row.fixed ? "FIXO" : "NÃO FIXO"}</td>
                                        <td>{row.dateOfSpent}</td>
                                        {location === "/gastos" && (
                                            <td>
                                                <MdDelete
                                                    style={{ color: "red" }}
                                                    onClick={(e) => openModal(e, row.id, row.description)}
                                                />
                                                <FaPen onClick={(e) => selected(e, row.id)} />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <ConfirmDeleteModal open={openModalDelete} onClose={() => setOpenModalDelete(false)} itemName={toolName} onConfirm={() => handleDeleteTool(toolToDelete)} remove={true} />

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

                    <div>
                        {filteredTools.length > 0 && !searchStatus && (
                            <div style={{ textAlign: "center", margin: "50px 0" }}>
                                <p style={{ fontSize: "20px" }}>
                                    Gasto total: {" "}
                                    <span style={{ color: "red" }}>
                                        {formateNumber(filteredTools.reduce((accumulator, currentItem) => {
                                            return accumulator + (currentItem.value || 0);
                                        }, 0))}
                                    </span>
                                </p>
                            </div>
                        )}

                        {searchStatus && (
                            <div style={{ textAlign: "center", margin: "50px 0" }}>
                                <p style={{ fontSize: "20px", color: "red" }}>
                                    Nenhum pagamento encontrado
                                </p>
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <input className={styles.btnReport} type="submit" value={"Gerar relatório"} onClick={handleReportSpent} />
                    </div>
                </div>
            )}
        </>
    );
};

export default SpentTable;
