import React, { useEffect, useState } from 'react';
import styles from './Table.module.css';
import api from '../../utils/api';

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

import { useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import ComponentMessage from '../componentMessage/ComponentMessage';
import Loading from '../loading/Loading';


const Table = ({ selected, loading, setLoadingClients, clients }) => {

  const [data, setData] = useState([clients])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [success, setSuccess] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false)
  const [loadingTable, setLoadingTable] = useState(true)
  const [ClientToDelete, setClientToDelete] = useState(null);  // Para armazenar o ID da ferramenta
  const [clientName, setClientName] = useState('');  // Para armazenar o nome da ferramenta
  const rowsPerPage = 10

  const location = useLocation().pathname;


  useEffect(() => {
    const fetchData = async () => {

      try {

        const response = await api.get("clients")
        setData(response.data)
        setLoadingClients(false)
        setLoadingTable(false)

      } catch (error) {
        console.log(error)
      }
    }
    fetchData()

  }, [clients])


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

      const response = await api.delete(`clients/delete/${id}`)
      console.log(response.data)

      setData(prevData => prevData.filter(data => data.id !== id))
      setOpenModal(false)
      setSuccess(response.data.message)


    } catch (error) {
      console.log(error)

    }

  }


  const openModalClient = (e, id, name) => {
    e.preventDefault();
    setClientToDelete(id);  // Salva o ID da ferramenta que será deletada
    setClientName(name);  // Salva o nome da ferramenta
    setOpenModal(true) // Abre o modal de confirmação
  };


  return (
    <>
      {loading || loadingTable ? (<Loading table={true}/>) : (
        <div className={styles.tableContainer}>
        {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
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
                  <td><MdDelete style={{ color: "red" }} onClick={(e) => openModalClient(e, row.id, row.name)} /> <FaPen onClick={(e) => selected(e, row.id)} /></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmDeleteModal open={openModal} itemName={clientName} onClose={() => setOpenModal(false)} onConfirm={() => handleDelete(ClientToDelete)} remove={true} />
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
      )}
    
    
    
    </>
    
  );
};

export default Table;
