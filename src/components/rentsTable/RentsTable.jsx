import api from "../../utils/api";
import styles from "../tableClients/Table.module.css";

import { useState, useEffect } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaPaste } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import { formateNumber } from "../../utils/formatNumber";
import ComponentMessage from "../componentMessage/ComponentMessage";

const RentsTable = ({ selected }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [NotFound, setNotFound] = useState(null)
  const [success, setSuccess] = useState(null)
  const [filteredTools, setFilteredTools] = useState([]);
  const [selectedFilter, setSelectedFiter] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCompleteRent, setOpenModalCompleteRent] = useState(false);
  const [rentToDeleteId, setRentToDeleteId] = useState("");
  const [rentToCompleteId, setRentToComplteId] = useState("");
  const [clientName, setClientName] = useState("");
  const rowsPerPage = 10;
  const location = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("http://localhost:8080/rent");
        setData(response.data);
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


    if(filteredData.length == 0) {
      setNotFound(true)
      return
    }
    setFilteredTools(filteredData);
    setCurrentPage(1);
    setNotFound(null)
    // Reinicia para a primeira página
  };

  const SelectedFilterSearch = (e) => {
    e.preventDefault()

    if (selectedFilter == 'finalizado') {
      setFilteredTools(data.filter(data => data.stateRent == 'PAID'))
      setCurrentPage(1);
    } else if (selectedFilter == 'vencendo') {
      setFilteredTools(data.filter(data => getDeliveryStatus(data.deliveryDate) == 'near'))
      setCurrentPage(1)
    } else if (selectedFilter == 'atrasado') {
      setFilteredTools(data.filter(data => getDeliveryStatus(data.deliveryDate) == 'overdue' && data.stateRent != 'PAID'))
      setCurrentPage(1)
    }
    else {
      setFilteredTools('')
    }
    console.log(selectedFilter)
  }

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
      setOpenModal(false);
      setSuccess(response.data.message)

      setData((prevData) => prevData.filter((rent) => rent.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const completeRent = async (id) => {
    try {
      await api.put(`/rent/completed/${id}`);
      setOpenModalCompleteRent(false);

      setData((prevData) =>
        prevData.map((rent) =>
          rent.id === id ? { ...rent, stateRent: "PAID" } : rent
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openPdf = (rent) => {
    const transformedRentItems = rent.rentItems.map((item) => ({
      ...item,
      name: item.tool.name, // Inclui todas as propriedades de `tool` no mesmo nível
      tool: undefined,
    }));

    const rentData = {
      client: rent.client,
      items: transformedRentItems,
      price: rent.price,
      initialDate: rent.initialDate,
      deliveryDate: rent.deliveryDate,
    };
    navigate("/pdf", { state: rentData });
  };

  const openModalClient = (e, id, name) => {
    e.preventDefault();
    setRentToDeleteId(id); // Salva o ID da ferramenta que será deletada
    setClientName(name); // Salva o nome da ferramenta
    setOpenModal(true); // Abre o modal de confirmação
  };

  const openModalFinishRnet = (e, id, name) => {
    e.preventDefault();
    setClientName(name);
    setOpenModalCompleteRent(true);
    setRentToComplteId(id);
  };

  // Função para converter a data dd/MM/yyyy para um objeto Date
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/"); // Separa a string em dia, mês e ano
    return new Date(year, month - 1, day); // Retorna uma data no formato Date
  };

  // Função para calcular a diferença em dias entre a data de entrega e a data atual
  const getDeliveryStatus = (deliveryDate) => {
    const currentDate = new Date();
    const delivery = parseDate(deliveryDate); // Converte a deliveryDate para um objeto Date
    const timeDiff = delivery - currentDate; // Diferença em milissegundos
    const dayDiff = timeDiff / (1000 * 3600 * 24); // Convertendo para dias

    if (dayDiff < 0) {
      // Se a data já passou
      return "overdue";
    } else if (dayDiff <= 2) {
      // Se a data está próxima (menos de 2 dias)
      return "near";
    }
    return "onTime"; // Se a data ainda está distante
  };



  return (
    <div className={styles.tableContainer}>
        {/* Exibe a mensagem de sucesso */}
        {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
      <form className={styles.searchContainer} onSubmit={SelectedFilterSearch}>
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
        <select name="filter" id="filter" onChange={e => setSelectedFiter(e.target.value)} value={selectedFilter}>
          <option value="">Filtro</option>
          <option value="finalizado">Finalizado</option>
          <option value="vencendo">Vencendo</option>
          <option value="atrasado">Atrasado</option>
        </select>
        <input type="submit" value="Pesquisar" />
      </form>
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
          {NotFound ? (<div className={styles.messageNotFound}><p>Nenhuma Locação encontrada</p></div>) : currentData.map((row) => (
            <tr
              key={row.id}
              onClick={location == "/alugar" ? () => selected(row) : undefined}
              style={{
                backgroundColor:
                  row.stateRent === "PAID"
                    ? "#2ecc70bd"
                    : getDeliveryStatus(row.deliveryDate) === "near"
                      ? "#f1c40fca" // Amarelo para datas próximas (menos de 2 dias)
                      : getDeliveryStatus(row.deliveryDate) === "overdue"
                        ? "#ff190084" // Vermelho para datas passadas
                        : "",
              }}
            >
              <td>{row.id}</td>
              <td>{row.client.name}</td>
              <td>{row.client.addresses[0].street}</td>
              <td>{row.initialDate}</td>
              <td>{row.deliveryDate}</td>
              <td>{formateNumber(row.price)}</td>
              <td>{row.stateRent == 'PAID' ? 'FINALIZADO' : 'PENDENTE'}</td>
              {location == "/alugueis" && (
                <td style={{ display: "flex", justifyContent: "space-around" }}>
                  <MdDelete
                    color="red"
                    onClick={(e) => openModalClient(e, row.id, row.client.name)}
                  />{" "}
                  <FaPen onClick={(e) => selected(e, row.id)} />{" "}
                  <FaPaste onClick={() => openPdf(row)} />{" "}
                  <MdOutlineDoneOutline
                    color="green"
                    onClick={
                      row.stateRent === "PENDENT"
                        ? (e) => openModalFinishRnet(e, row.id, row.client.name)
                        : null
                    }
                  />
                </td>
              )}
            </tr>
          ))}
        
        </tbody>
      </table>
      <ConfirmDeleteModal
        open={openModal}
        itemName={clientName}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleDeleteRent(rentToDeleteId)}
        remove={true}
      />
      <ConfirmDeleteModal
        open={openModalCompleteRent}
        itemName={clientName}
        onClose={() => setOpenModalCompleteRent(false)}
        onConfirm={() => completeRent(rentToCompleteId)}
        completeRent={true}
      />
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
