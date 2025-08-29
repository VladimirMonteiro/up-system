import api from "../../utils/api";
import styles from "../tableClients/Table.module.css";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaPaste } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import { formateNumber } from "../../utils/formatNumber";
import ComponentMessage from "../componentMessage/ComponentMessage";
import Loading from "../loading/Loading";

const RentsTable = ({ selected, rents, singleClient }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState(null);
  const [filteredTools, setFilteredTools] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCompleteRent, setOpenModalCompleteRent] = useState(false);
  const [rentToDeleteId, setRentToDeleteId] = useState("");
  const [rentToCompleteId, setRentToCompleteId] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;
  const location = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (singleClient) {
          setClient(singleClient);
          setData(rents || singleClient.rents || []);
        } else if (rents) {
          setData(rents);
        } else {
          const response = await api.get("rent");
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [rents, singleClient]);

  const handleSearch = (searchTerm) => {
    const filteredData = data.filter((rent) =>
      Object.values(rent.client || {}).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filteredData.length === 0) {
      setNotFound(true);
    } else {
      setFilteredTools(filteredData);
      setNotFound(false);
    }
    setCurrentPage(1);
  };

  const selectedFilterSearch = (e) => {
    e.preventDefault();
    let filtered;
    switch (selectedFilter) {
      case "finalizado":
        filtered = data.filter((rent) => rent.stateRent === "PAID");
        break;
      case "vencendo":
        filtered = data.filter(
          (rent) => getDeliveryStatus(rent.deliveryDate) === "near"
        );
        break;
      case "atrasado":
        filtered = data.filter(
          (rent) =>
            getDeliveryStatus(rent.deliveryDate) === "overdue" &&
            rent.stateRent !== "PAID"
        );
        break;
      default:
        filtered = data;
        break;
    }

    setFilteredTools(filtered);
    setNotFound(filtered.length === 0);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    (filteredTools.length > 0 ? filteredTools : data).length / rowsPerPage
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = (filteredTools.length > 0 ? filteredTools : data).slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePrevious = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteRent = async (id) => {
    try {
      const response = await api.delete(`rent/delete/${id}`);
      setOpenModal(false);
      setSuccess(response.data.message);

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
    // transforma os itens (isso é sempre igual)
    const transformedRentItems = rent.rentItems.map((item) => ({
      ...item,
      name: item.tool.name,
      tool: undefined,
    }));

    // pega o cliente: se existir singleClient usa ele, senão pega do próprio rent
    const clientData = singleClient || rent.client;

    const rentData = {
      client: clientData,
      items: transformedRentItems,
      price: rent.price,
      initialDate: rent.initialDate,
      deliveryDate: rent.deliveryDate,
      freight: rent.freight,
      obs: rent.obs,
    };

    navigate("/pdf", { state: rentData });
  };


  const openModalClient = (e, id, name) => {
    e.preventDefault();
    setRentToDeleteId(id);
    setClientName(name);
    setOpenModal(true);
  };

  const openModalFinishRent = (e, id, name) => {
    e.preventDefault();
    setClientName(name);
    setOpenModalCompleteRent(true);
    setRentToCompleteId(id);
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  };

  const getDeliveryStatus = (deliveryDate) => {
    const currentDate = new Date();
    const delivery = parseDate(deliveryDate);
    const timeDiff = delivery - currentDate;
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff < 0) return "overdue";
    else if (dayDiff <= 2) return "near";
    return "onTime";
  };

  const getRowClass = (row) => {
    if (row.stateRent === "PAID") return styles.rowPaid;

    const status = getDeliveryStatus(row.deliveryDate);

    if (status === "near") return styles.rowNear;
    if (status === "overdue") return styles.rowOverdue;

    return "";
  };


  return (
    <>
      {loading ? (
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
          <form
            className={styles.searchContainer}
            onSubmit={selectedFilterSearch}
          >
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
            <select
              name="filter"
              id="filter"
              onChange={(e) => setSelectedFilter(e.target.value)}
              value={selectedFilter}
            >
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
                <th>Status</th>
                {(location === "/alugueis" || location === `/clientes/${client?.id}` || location === "/inicial") && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {notFound ? (
                <tr style={{ border: "none" }}>
                  <td
                    style={{ border: "none" }}
                    colSpan="7"
                    className={styles.messageNotFound}
                  >
                    Nenhuma Locação encontrada
                  </td>
                </tr>
              ) : (
                currentData.map((row) => (
                  <tr
                    key={row.id}
                    onClick={location === "/alugar" ? () => selected(row) : undefined}
                    className={`${styles.tableRow} ${getRowClass(row)}`}
                  >


                    <td>{row.id}</td>
                    <td>{row.client?.name || client.name}</td>
                    <td>{row.client?.addresses?.[0]?.street || client.addresses[0].street}</td>
                    <td>{row.initialDate}</td>
                    <td>{row.deliveryDate}</td>
                    <td>{formateNumber(row.price)}</td>
                    <td>
                      {row.stateRent === "PAID" ? "FINALIZADO" : "PENDENTE"}
                    </td>
                    {(location === "/alugueis" || location === `/clientes/${client?.id}` || location === "/inicial") && (
                      <td>
                        <MdDelete
                          style={{ marginRight: "5px" }}
                          color="red"
                          onClick={(e) =>
                            openModalClient(e, row.id, row.client?.name)
                          }
                        />
                        {/**  <FaPen style={{ marginRight: "5px" }} onClick={(e) => selected(e, row.id)} />*/}
                       
                        <FaPaste style={{ marginRight: "5px" }} onClick={() => openPdf(row)} />
                        <MdOutlineDoneOutline
                          color="green"
                          onClick={
                            row.stateRent === "PENDENT"
                              ? (e) =>
                                openModalFinishRent(
                                  e,
                                  row.id,
                                  row.client?.name
                                )
                              : null
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
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
      )}
    </>

  );
};

export default RentsTable;
