
import api from '../../utils/api';
import styles from '../tableClients/Table.module.css'

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";





const TableTools = ({selected}) => {



    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTools, setFilteredTools] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const location = useLocation().pathname


    useEffect(() => {
        const fetchData = async () => {
            console.log("renderizou")

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

    const handleDeleteTool = async(id) => {
        
        try {
            const response = await api.delete(`http://localhost:8080/tools/delete/${id}`)
            console.log(response.data)
         

            setData(prevData => prevData.filter(tool => tool.id !== id));
            
        } catch (error) {
            console.log(error)
            
        }
       
    }

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
                        {location == "/ferramentas" && (
                            <th>Ações</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row) => (
                        <tr key={row.id}  onClick={location == "/alugar" ? () => selected(row) : undefined}
                        style={row.quantity === 0 ? { backgroundColor: '#ffcccc' } : {}}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.quantity}un</td>
                            <td>R${row.daily}</td>
                            <td>R${row.week}</td>
                            <td>R${row.priceMonth}</td>
                            {location == "/ferramentas" && (
                                <td><MdDelete style={{color: "red"}} onClick={() => handleDeleteTool(row.id)}/> <FaPen onClick={(e) => selected(e, row.id)} /></td>
                            )}
                           
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