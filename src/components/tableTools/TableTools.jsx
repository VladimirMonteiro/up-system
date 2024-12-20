
import api from '../../utils/api';
import styles from '../tableClients/Table.module.css'

import { useState, useEffect } from 'react';

const TableTools = ({selected}) => {



    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTools, setFilteredTools] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;


    useEffect(() => {
        const fetchData = async () => {

            try {

                const response = await api.get("http://localhost:8080/tools")
                setData(response.data)

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()

    }, [])


    const handleSearch = (searchTerm) => {
        const filteredData = data.filter((tool) =>
            Object.values(tool).some((value) =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredTools(filteredData);
        setCurrentPage(1); // Reinicia para a primeira página
    };


    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = (filteredTools.length > 0 ? filteredTools : data).slice(
        startIndex,
        startIndex + rowsPerPage
    );


    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));


    return (
        <div className={styles.tableContainer}>
            <div className={styles.searchContainer}>
                <label htmlFor="search">Pesquisar</label>
                <input type="text" id="search" placeholder="Digite para buscar..." value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }} />
                <input type="submit" value="Pesquisar" />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Diária</th>
                        <th>Semanal</th>
                        <th>Mensal</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row) => (
                        <tr key={row.id} onClick={() => selected(row)}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.quantity}ud</td>
                            <td>R${row.daily}</td>
                            <td>R${row.week}</td>
                            <td>R${row.priceMonth}</td>
                           
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
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Próxima
                </button>
            </div>
        </div>
    )
}


export default TableTools