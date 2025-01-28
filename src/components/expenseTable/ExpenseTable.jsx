import api from '../../utils/api';
import styles from '../tableClients/Table.module.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';

import { formateNumber } from '../../utils/formatNumber'
import ComponentMessage from '../componentMessage/ComponentMessage';

const ExpenseTable = ({ selected, expenses }) => {
    const [data, setData] = useState(expenses);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchStatus, setSearchStatus] = useState(false); // Controle para mostrar "Nenhum pagamento encontrado"
    const [filteredTools, setFilteredTools] = useState([]);
    const [success, setSuccess] = useState(null);  // Estado para a mensagem de sucesso
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const location = useLocation().pathname;

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
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [expenses]);

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
                data.description.toLowerCase().includes(searchTerm.toLowerCase()) // Considera "includes" para maior flexibilidade
            );
        }

        // Filtro por ano selecionado
        if (selectedYear) {
            filteredData = filteredData.filter((data) =>
                new Date(data.dateOfSpent).getFullYear() === parseInt(selectedYear) 
            ||
            data.fixed == true // Considera "includes" para maior flexibilidade// Comparando o ano da data
            );
        }
        // Filtro por mês selecionado
        if (selectedMonth) {
            filteredData = filteredData.filter((data) =>
                new Date(data.dateOfSpent).getMonth() === (parseInt(selectedMonth) - 1)
            ||
            data.fixed == true // Considera "includes" para maior flexibilidade // Comparando o mês da data
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
            setSuccess(response.data.message)
            setOpenModalDelete(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.tableContainer} style={{ width: "45%" }}>
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

                {/* Exibe a mensagem de sucesso */}
                {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}

            {!searchStatus && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Data de pagamento</th>
                            <th>Tipo</th>
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
                                <td>{row.dateOfSpent}</td>
                                <td>{row.fixed ? 'FIXO' : 'NÃO FIXO'}</td>
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
                                { formateNumber(filteredTools.reduce((accumulator, currentItem) => {
                                    return (accumulator + currentItem.value);
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
        </div>
    );
};

export default ExpenseTable;
