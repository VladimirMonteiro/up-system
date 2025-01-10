import api from "../../utils/api";
import styles from "../tableClients/Table.module.css";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaPaste } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";


const RentsTable = ({ selected }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false)
  const [rentToDeleteId, setRentToDeleteId] = useState("")
  const [clientName, setClientName] = useState("") 
  const rowsPerPage = 10;
  const location = useLocation().pathname;
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      console.log("renderizou");

      try {
        const response = await api.get("http://localhost:8080/rent");
        setData(response.data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filteredData = data.filter((rent) =>
      Object.values(rent.client).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteRent = async (id) => {
    try {
      const response = await api.delete(
        `http://localhost:8080/rent/delete/${id}`
      );
      setOpenModal(false)

      setData((prevData) => prevData.filter((rent) => rent.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const completeRent = async(id) => {
    try {
        const response = await api.put(`/rent/completed/${id}`)
        console.log(response.data)
        setData(prevData => prevData.map(rent => 
            rent.id === id ? { ...rent, stateRent: 'PAID' } : rent
        ));
        
    } catch (error) {
        console.log(error)
    }
  }
  
  const openPdf = (rent) => {

    const transformedRentItems = rent.rentItems.map(item => ({
      ...item,
      name: item.tool.name, // Inclui todas as propriedades de `tool` no mesmo nível
      tool: undefined, 
    }));

    const rentData = {
        client: rent.client,
        items: transformedRentItems,
        price: rent.price,
        initialDate: rent.initialDate,
        deliveryDate: rent.deliveryDate
    }
    navigate("/pdf", {state: rentData})
    console.log(rentData)
    
  }


  const openModalClient = (e, id, name) => {
    e.preventDefault();
    setRentToDeleteId(id);  // Salva o ID da ferramenta que será deletada
    setClientName(name);  // Salva o nome da ferramenta
    setOpenModal(true) // Abre o modal de confirmação
  };



  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <label htmlFor="search">Pesquisar</label>
        <input
          type="text"
          id="search"
          placeholder="Digite para buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <input type="submit" value="Pesquisar" />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Endereço</th>
            <th>Data inicial</th>
            <th>Data final</th>
            <th>Valor</th>
            <th>status</th>
            {location == "/alugueis" && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr
              key={row.id}
              onClick={location == "/alugar" ? () => selected(row) : undefined}
              style={row.stateRent === 'PAID' ? { backgroundColor: "#2ecc71" } : {}}
            >
              <td>{row.id}</td>
              <td>{row.client.name}</td>
              <td>{row.client.addresses[0].street}</td>
              <td>{row.initialDate}</td>
              <td>{row.deliveryDate}</td>
              <td>R${row.price}</td>
              <td>{row.stateRent}</td>
              {location == "/alugueis" && (
                <td style={{display: "flex", justifyContent: "space-around"}}>
                  <MdDelete color="red"
                    onClick={(e) => openModalClient(e, row.id, row.client.name)}
                  />{" "}
                  <FaPen onClick={(e) => selected(e, row.id)} /> <FaPaste onClick={() => openPdf(row)} /> <MdOutlineDoneOutline color="green" onClick={() => completeRent(row.id)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteModal open={openModal} itemName={clientName} onClose={()=> setOpenModal(false)} onConfirm={() => handleDeleteRent(rentToDeleteId)}/>
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

export default RentsTable;
