import React, { useEffect, useState } from 'react';
import styles from './Table.module.css';
import api from '../../utils/api';

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

import { useLocation } from 'react-router-dom';

const Table = ({ selected }) => {

  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10

  const location = useLocation().pathname;


  useEffect(() => {
    const fetchData = async () => {

      try {

        const response = await api.get("http://localhost:8080/clients")
        setData(response.data)

      } catch (error) {
        console.log(error)
      }
    }
    fetchData()

  }, [])


  const handleSearch = (searchTerm) => {
    const filteredData = data.filter((client) =>
      Object.values(client).some((value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredClients(filteredData);
    setCurrentPage(1); // Reinicia para a primeira página
  };


  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = (filteredClients.length > 0 ? filteredClients : data).slice(
    startIndex,
    startIndex + rowsPerPage
  );


  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));


  const handleDelete = async (id) => {

    try {

      const response = await api.delete(`http://localhost:8080/clients/delete/${id}`)
      console.log(response.data)

      setData(prevData => prevData.filter(data => data.id !== id))
      

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
            <th>CPF/CNPJ</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Cidade</th>
            <th>Bairro</th>
            <th>CEP</th>
            {location == "/clientes" && (
              <th>Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id} onClick={location == "/alugar" ? () => selected(row) : undefined}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.cpf ? row.cpf : row.cnpj}</td>
              <td>{row.phones[0]}</td>
              <td>{row.addresses[0].street} - {row.addresses[0].number}</td>
              <td>{row.addresses[0].city}</td>
              <td>{row.addresses[0].neighborhood}</td>
              <td>{row.addresses[0].cep}</td>
              {location == "/clientes" && (
                <td><MdDelete style={{ color: "red" }} onClick={() => handleDelete(row.id)} /> <FaPen onClick={(e) => selected(e, row.id)} /></td>
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
  );
};

export default Table;
