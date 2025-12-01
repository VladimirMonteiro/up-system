
import api from "../../utils/api";
import styles from "../tableClients/Table.module.css";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPen, FaPaste } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConfirmDeleteModal from "../modalConfirmDelete/ConfirmDeleteModal";
import { formateNumber } from "../../utils/formatNumber";
import ComponentMessage from "../componentMessage/ComponentMessage";
import Loading from "../loading/Loading";

const RentsTable = ({ selected, rents, singleClient }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(undefined);
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCompleteRent, setOpenModalCompleteRent] = useState(false);
  const [rentToDeleteId, setRentToDeleteId] = useState("");
  const [rentToCompleteId, setRentToCompleteId] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [stateRent, setStateRent] = useState("");

  const [currentPage, setCurrentPage] = useState(0); // backend começa em 0
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const location = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [rents, singleClient, currentPage]);

  const fetchData = async (page = 0) => {
    try {
      setLoading(true);
      if (singleClient) {
        setClient(singleClient);
        setData(singleClient.rents || []);
        setTotalPages(1);
      } else if (rents) {
        setData(rents);
        setTotalPages(1);
      } else {
        const response = await api.get(`/rent?page=${page}&size=${rowsPerPage}`);
        setData(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      }
      setNotFound(false);
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const selectedFilterSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `/rent/filter?page=${currentPage}&size=${rowsPerPage}&clientName=${encodeURIComponent(
        clientName || ""
      )}&paymentStatus=${paymentStatus || ""}&stateRent=${stateRent || ""}`;

      const response = await api.get(url);
      setData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setNotFound((response.data.content || []).length === 0);
    } catch (error) {
      console.error("Erro ao buscar aluguéis filtrados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

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
      await api.put(`/rent/completed/${id}`, {});
      setOpenModalCompleteRent(false);
      setData((prevData) =>
        prevData.map((rent) =>
          rent.id === id
            ? { ...rent, paymentStatus: "PAID", stateRent: "DELIVERED" }
            : rent
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openPdf = (rent) => {
    const transformedRentItems = rent.rentItems.map((item) => ({
      ...item,
      name: item.tool.name,
      tool: undefined,
    }));
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

  const getDeliveryStatus = (deliveryDate, paymentStatus, stateRent) => {
    const currentDate = new Date();
    const delivery = parseDate(deliveryDate);
    const timeDiff = delivery.getTime() - currentDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (dayDiff < 0 && (paymentStatus !== "PAID" || stateRent !== "DELIVERED")) {
      return "overdue";
    }
    if (dayDiff <= 2 && (paymentStatus !== "PAID" || stateRent !== "DELIVERED")) {
      return "near";
    }
    return "onTime";
  };

  const getRowClass = (row) => {
    if (row.stateRent === "DELIVERED") return styles.rowPaid;
    if (row.stateRent === "PENDENT") return styles.rowOverdue;
    return "";
  };

  const getDeliveryStatusStyle = (row) => {
    const status = getDeliveryStatus(
      row.deliveryDate,
      row.paymentStatus,
      row.stateRent
    );
    if (status === "near") return styles.rowNear;
    if (status === "overdue") return styles.rowOverdue;
    return "";
  };

  const getRowClassPaymentStatus = (row) => {
    if (row.paymentStatus === "PAID") return styles.rowPaid;
    if (row.paymentStatus === "PARTIALLY_PAID") return styles.rowNear;
    if (row.paymentStatus === "UNPAID") return styles.rowOverdue;
    return "";
  };

  const getPaymentStatus = (payment) => {
    if (payment === "PAID") return "PAGO";
    if (payment === "UNPAID") return "NÃO PAGO";
    if (payment === "PARTIALLY_PAID") return "PARC PAGO";
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

          <form className={styles.searchContainer} onSubmit={selectedFilterSearch}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="search"
                placeholder="Digite para buscar..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={styles.input}
              />
              <select
                name="paymentStatus"
                id="paymentStatus"
                onChange={(e) => setPaymentStatus(e.target.value)}
                value={paymentStatus}
                className={styles.select}
              >
                <option value="">Status de Pagamento</option>
                <option value="PAID">Pago</option>
                <option value="PARTIALLY_PAID">Parcialmente pago</option>
                <option value="UNPAID">Não pago</option>
              </select>
              <select
                name="stateRent"
                id="stateRent"
                onChange={(e) => setStateRent(e.target.value)}
                value={stateRent}
                className={styles.select}
              >
                <option value="">Estado do Aluguel</option>
                <option value="DELIVERED">Entregue</option>
                <option value="PENDENT">Pendente</option>
              </select>
              <button type="submit" className={styles.button}>
                Pesquisar
              </button>
            </div>
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
                <th>Pagamento</th>
                <th>Devolução equip</th>
                {(location === "/alugueis" ||
                  location === `/clientes/${client?.id}` ||
                  location === "/inicial") && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {notFound ? (
                <tr>
                  <td colSpan="8" className={styles.messageNotFound}>
                    Nenhuma Locação encontrada
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    onClick={location === "/alugar" ? () => selected(row) : undefined}
                  >
                    <td>{row.id}</td>
                    <td>{row.client?.name || client?.name}</td>
                    <td>
                      {row.client?.addresses?.[0]?.street ||
                        client?.addresses?.[0]?.street}
                    </td>
                    <td>{row.initialDate}</td>
                    <td className={getDeliveryStatusStyle(row)}>{row.deliveryDate}</td>
                    <td>{formateNumber(row.price)}</td>
                    <td>
                      <span
                        className={`${styles.tableRow} ${getRowClassPaymentStatus(row)}`}
                      >
                        {getPaymentStatus(row.paymentStatus)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.tableRow} ${getRowClass(row)}`}>
                        {row.stateRent === "DELIVERED" ? "ENTREGUE" : "PENDENTE"}
                      </span>
                    </td>
                    {(location === "/alugueis" ||
                      location === `/clientes/${client?.id}` ||
                      location === "/inicial") && (
                        <td>
                          <MdDelete
                            style={{ marginRight: "5px" }}
                            color="red"
                            onClick={(e) => openModalClient(e, row.id, row.client?.name)}
                          />
                          <FaPen
                            style={{ marginRight: "5px" }}
                            onClick={(e) => selected(e, row.id)}
                          />
                          <FaPaste
                            style={{ marginRight: "5px" }}
                            onClick={() => openPdf(row)}
                          />
                          <MdOutlineDoneOutline
                            color="green"
                            onClick={
                              row.stateRent === "PENDENT" || row.paymentStatus !== "PAID"
                                ? (e) =>
                                  openModalFinishRent(e, row.id, row.client?.name)
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
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              Anterior
            </button>
            <span>
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage + 1 >= totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RentsTable;

