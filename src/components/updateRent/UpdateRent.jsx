import { useState, useEffect } from "react";
import styles from "./UpdateRent.module.css"; // Importando o CSS Module
import api from "../../utils/api";
import Modal from "../modal/Modal";
import TableTools from "../tableTools/TableTools"; // Componente que lista as ferramentas
import { formateNumber } from "../../utils/formatNumber";
import ComponentMessage from "../componentMessage/ComponentMessage";
import RentPaymentsTable from "../rentPaymentsTable/RentPaymentsTable";
import { formatCurrency, formatInputToCurrency, parseCurrencyToFloat } from "../../utils/formatCurrency";

const UpdateRent = ({ rent }) => {
  const [client, setClient] = useState({});
  const [listItems, setListItems] = useState([]);
  const [initialDate, setInitialDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [freight, setFreight] = useState("");
  const [isToolModalOpen, setToolModalOpen] = useState(false); // Estado para o modal de ferramenta
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false)
  const [payments, setPayments] = useState([])
  const [paymentStatus, setPaymentStatus] = useState("")
  const [stateRent, setStateRent] = useState("")

  console.log(rent)

  useEffect(() => {
    if (rent) {
      setClient(rent.client || {});
      setListItems(rent.rentItems || []);
      setFreight(rent.freight || "");
      setInitialDate(formatDate(rent.initialDate) || "");
      setDeliveryDate(formatDate(rent.deliveryDate) || "");
      setPaymentStatus(rent.paymentStatus || "")
      setStateRent(rent.stateRent || "")
    }

    const getPayments = async (id) => {
      const response = await api.get(`/earning/rent/${rent.id}`)
      setPayments(response.data)
    }

    getPayments()
  }, [rent]);
  useEffect(() => {
    const total = calculateTotal();
    const paid = calculateTotalPaid();

    let status = "UNPAID";
    if (paid >= total) {
      status = "PAID";
    } else if (paid > 0 && paid < total) {
      status = "PARTIALLY_PAID";
    }

    setPaymentStatus(status);

    // Se quiser atualizar o objeto rent localmente
    rent.paymentStatus = status;

  }, [listItems, freight, payments]);


  console.log(rent)

  const handleUpdateItem = (index, updatedItem) => {
    const updatedList = [...listItems];
    updatedList[index] = updatedItem;
    setListItems(updatedList);
  };


  const handleDeleteItem = async (index) => {
    const updatedList = listItems.filter((_, i) => i !== index);
    setListItems(updatedList);
  };

  const handleUpdateRent = async (e) => {
    e.preventDefault();

    const updatedRent = {
      rentId: rent.id,
      items: listItems.map((item) => ({
        toolId: item.tool.id,
        quantity: item.quantity,
        price: parseCurrencyToFloat(item.price),
      })),
      price: calculateTotal(),
      deliveryDate,
      initialDate,
      freight: parseCurrencyToFloat(freight),
    };


    try {
      const response = await api.put(`/rent/update/${rent.id}`, updatedRent);
      console.log(response.data);
      setSuccess(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };

  const openTools = (e) => {
    e.preventDefault();
    setToolModalOpen(true); // Abre o modal de ferramentas
  };

  const closeToolModal = () => {
    setToolModalOpen(false); // Fecha o modal
  };

  const handleSelectTool = (tool) => {
    // Verifica se a ferramenta já está na lista de itens
    const isToolAlreadyInList = listItems.some(
      (item) => item.tool.id === tool.id
    );

    if (!isToolAlreadyInList) {
      // Adiciona a ferramenta à lista de itens
      const newItem = {
        tool,
        quantity: 1,
        price: tool.price || 0,
      };

      setListItems((prevItems) => [...prevItems, newItem]); // Atualiza a lista
    }

    closeToolModal(); // Fecha o modal
  };

  // Função para calcular o total de cada item (quantidade * preço)
  const calculateItemTotal = (quantity, price) => {
    const priceFloat = parseCurrencyToFloat(price);
    return (quantity * priceFloat).toFixed(2);
  };

  // Função para calcular o total geral (somando os totais dos itens)
  const calculateTotal = () => {
    const totalItems = listItems
      .map(item => item.quantity * parseCurrencyToFloat(item.price))
      .reduce((acc, cur) => acc + cur, 0);

    const freightValue = parseCurrencyToFloat(freight || "0");

    return totalItems + freightValue;
  };



  const formatDate = (inputDate) => {
    // Divide a data fornecida em partes (dia, mês, ano)
    const [day, month, year] = inputDate.split("/");

    // Retorna a data no formato yyyy-MM-dd
    return `${year}-${month}-${day}`;
  };
  const getPaymentStatus = (payment) => {
    if (payment === "PAID") return "PAGO"
    if (payment === "UNPAID") return "NÃO PAGO"
    if (payment === "PARTIALLY_PAID") return "PARCIALMENTE PAGO"
  }

  const getRowClassPaymentStatus = (row) => {
    if (row.paymentStatus === "PAID") {
      return styles.rowPaid
    }
    if (row.paymentStatus === "PARTIALLY_PAID") {
      return styles.rowNear
    }
    if (row.paymentStatus === "UNPAID") {
      return styles.rowOverdue;
    }

    return "";
  };

  const calculateTotalPaid = () => {
    return payments
      .map(payment => parseFloat(payment.price || 0))
      .reduce((acc, cur) => acc + cur, 0);
  };


  const calculateBalance = () => {
    const total = calculateTotal();
    const paid = calculateTotalPaid();

    const balance = total - paid;

    return balance > 0 ? balance : 0;
  };


  const handleFreightChange = (e) => {
    const formatted = formatInputToCurrency(e.target.value);
    setFreight(formatted);
  };

  const toggleDeliveryStatus = async () => {
    try {
      const response = await api.put(`/rent/${rent.id}/deliveryTool`);

      // Se a API retornar o novo status atualizado:
      const updatedStatus = response.data?.state || (stateRent === "DELIVERED" ? "PENDING" : "DELIVERED");

      setStateRent(updatedStatus);
      setSuccess(`Status alterado para ${updatedStatus === "DELIVERED" ? "ENTREGUE" : "PENDENTE"}`);
    } catch (error) {
      console.error("Erro ao atualizar status de entrega:", error);
      alert("Erro ao atualizar o status. Tente novamente.");
    }
  };



  return (
    <section className={styles.section}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Atualizar Locação</h2>
        <h3><span className={getRowClassPaymentStatus({ paymentStatus: paymentStatus })}>{getPaymentStatus(paymentStatus)}</span></h3>
      </div>



      {success && (
        <ComponentMessage
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      <form className={styles.form} onSubmit={handleUpdateRent}>
        {/* Cliente + Botão Selecionar */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="client" className={styles.label}>Cliente</label>
            <input
              type="text"
              id="client"
              value={client.name || ''}
              disabled
              className={styles.input}
            />
          </div>
          <button type="button" onClick={openTools} className={styles.selectButton}>
            Selecionar
          </button>
        </div>

        {/* Datas e Frete */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="initialDate" className={styles.label}>Data Inicial</label>
            <input
              type="date"
              id="initialDate"
              value={initialDate || ''}
              onChange={(e) => setInitialDate(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deliveryDate" className={styles.label}>Data de Entrega</label>
            <input
              type="date"
              id="deliveryDate"
              value={deliveryDate || ''}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Frete</label>
            <input
              type="text"
              placeholder="Frete"
              onChange={(e) => handleFreightChange(e)}
              value={freight || ''}
              className={styles.input}
            />
          </div>
        </div>

        {/* Modal Ferramentas */}
        <Modal isOpen={isToolModalOpen} onClose={closeToolModal} height={"90vh"} overflow={"scroll"}>
          <h3>Selecione uma Ferramenta</h3>
          <TableTools selected={handleSelectTool} loading={loading} setLoading={() => { }} />
          <button onClick={closeToolModal} className={styles.closeModalButton}>Fechar</button>
        </Modal>

        {/* Lista de Itens */}
        <div className={styles.itemsSection}>
          <div className={styles.statusContainer}>
            <h3 className={styles.subTitle}>Itens da Locação</h3>

            {/* Status de Entrega */}
            {listItems.length > 0 && (
              <div className={styles.deliveryStatus}>
                {stateRent === "DELIVERED" ? (
                  <span className={`${styles.statusTag} ${styles.statusDelivered}`}>
                    ✅ Todos os itens foram entregues
                  </span>
                ) : (
                  <span className={`${styles.statusTag} ${styles.statusPending}`}>
                    ⏳ Entrega pendente para alguns itens
                  </span>
                )}
                <button
                  className={styles.toggleStatusButton}
                  onClick={toggleDeliveryStatus}
                  type="button"
                >
                  {stateRent === "DELIVERED" ? "Marcar como Pendente" : "Marcar como Entregue"}
                </button>
              </div>
            )}
          </div>

          {listItems.length > 0 ? (
            <ul className={styles.itemList}>
              {listItems.map((item, index) => (
                <li key={index} className={styles.itemCard}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome</label>
                    <input type="text" value={item.tool.name || ''} readOnly className={styles.input} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Quantidade</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(index, { ...item, quantity: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Preço</label>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          ...item,
                          price: formatInputToCurrency(e.target.value),
                        })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Total</label>
                    <input
                      type="text"
                      value={calculateItemTotal(item.quantity, item.price)}
                      readOnly
                      className={styles.input}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>Nenhum item adicionado.</p>
          )}
        </div>

        {/* Total Geral */}
        <div className={styles.totalRow}>
          <div className={styles.totalItem}>
            <label className={styles.totalLabel}>Total Locação:</label>
            <span className={styles.totalValue}>{formateNumber(calculateTotal())}</span>
          </div>
          <div className={styles.totalItem}>
            <label className={styles.totalLabel}>Total Pago:</label>
            <span className={styles.totalValuePaid}>{formateNumber(calculateTotalPaid())}</span>
          </div>
          <div className={styles.totalItem}>
            <label className={styles.totalLabel}>Saldo Devedor:</label>
            <span
              className={`${styles.totalValue} ${calculateBalance() >= 0 ? styles.negativeBalance : styles.positiveBalance
                }`}
            >
              {formatCurrency(calculateBalance())}
            </span>
          </div>
        </div>


        {/* Submit */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitButton}>
            Atualizar
          </button>
        </div>
      </form>
      <div>
        <RentPaymentsTable payments={payments} setPayments={setPayments} rentId={rent.id} />
      </div>
    </section>
  );
};

export default UpdateRent;
