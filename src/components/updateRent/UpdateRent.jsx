import { useState, useEffect } from "react";
import styles from "./UpdateRent.module.css"; // Importando o CSS Module
import api from "../../utils/api";
import { handlePriceChange } from "../../utils/handlePriceChange";
import Modal from "../modal/Modal";
import TableTools from "../tableTools/TableTools"; // Componente que lista as ferramentas
import { formateNumber } from "../../utils/formatNumber";
import ComponentMessage from "../componentMessage/ComponentMessage";

const UpdateRent = ({ rent }) => {
  const [client, setClient] = useState({});
  const [listItems, setListItems] = useState([]);
  const [initialDate, setInitialDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [freight, setFreight] = useState("");
  const [isToolModalOpen, setToolModalOpen] = useState(false); // Estado para o modal de ferramenta
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (rent) {
      setClient(rent.client || {});
      setListItems(rent.rentItems || []);
      setFreight(rent.freight || "");
      setInitialDate(formatDate(rent.initialDate) || "");
      setDeliveryDate(formatDate(rent.deliveryDate) || "");
    }
  }, [rent]);

  const handleUpdateItem = (index, updatedItem) => {
    const updatedQuantity = parseInt(updatedItem.quantity, 10);
    const updatedPrice = parseFloat(updatedItem.price);

    if (!isNaN(updatedQuantity)) updatedItem.quantity = updatedQuantity;
    if (!isNaN(updatedPrice)) updatedItem.price = updatedPrice;

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
        toolId: item.tool.id, // Inclui o toolId da ferramenta selecionada
        quantity: item.quantity,
        price: item.price,
      })),
      price: listItems
        .map((item) => item.quantity * item.price)
        .reduce((acc, current) => acc + current, 0),
      deliveryDate,
      initialDate,
      freight: parseFloat(freight),
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
    return (quantity * price).toFixed(2); // Retorna o total formatado para 2 casas decimais
  };

  // Função para calcular o total geral (somando os totais dos itens)
  const calculateTotal = () => {
    return listItems
      .map((item) => item.quantity * item.price)
      .reduce((acc, current) => acc + current, parseFloat(freight || 0))
  };

  const formatDate = (inputDate) => {
    // Divide a data fornecida em partes (dia, mês, ano)
    const [day, month, year] = inputDate.split("/");

    // Retorna a data no formato yyyy-MM-dd
    return `${year}-${month}-${day}`;
  };

  return (
    <section className={styles.updateRentSection}>
      <h2 className={styles.updateRentTitle}>Atualizar Locação</h2>
      {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
      <form className={styles.updateRentForm} onSubmit={handleUpdateRent}>
        <div>
          <div className={styles.inputContainer2}>
            <label htmlFor="clientSelect" className={styles.formLabel}>
              Cliente
            </label>
            <input
              type="text"
              name="client"
              id="client"
              disabled
              value={client.name || ""}
            />
            <button onClick={openTools}>Selecionar</button>
          </div>

          <div className={styles.dateInputContainer} style={{ margin: "10px" }}>
            <input
              type="date"
              name="initialDate"
              id="initialDate"
              onChange={(e) => setInitialDate(e.target.value)}
              value={initialDate || ""}
            />
            <input
              type="date"
              name="deliveryDate"
              id="deliveryDate"
              onChange={(e) => setDeliveryDate(e.target.value)}
              value={deliveryDate || ""}
            />
            <input
              type="text"
              placeholder="Frete"
              onChange={(e) => handlePriceChange(e, setFreight)}
              value={freight || ""}
            />
          </div>

          <Modal isOpen={isToolModalOpen} onClose={closeToolModal} height={"auto"}>
            <h2>Selecione uma Ferramenta</h2>
            <TableTools
              selected={handleSelectTool} // Passa a função para selecionar a ferramenta
              loading={loading}
              setLoading={setLoading}
            />
            <button onClick={closeToolModal}>Fechar</button>
          </Modal>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rentItems" className={styles.formLabel}>
            Itens da Locação
          </label>
          <ul className={styles.rentItemsList}>
            {listItems.length > 0 ? (
              listItems.map((item, index) => (
                <li key={index} className={styles.rentItem}>
                  <div className={styles.inputGroup}>
                    <label htmlFor={`name`} className={styles.itemLabel}>
                      Nome
                    </label>
                    <input
                      id={`item-name-${index}`}
                      type="text"
                      value={item.tool.name || ""}
                      readOnly
                      className={styles.readOnlyInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={`item-quantity-${index}`} className={styles.itemLabel}>
                      Quantidade
                    </label>
                    <input
                      id={`item-quantity-${index}`}
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          ...item,
                          quantity: e.target.value,
                        })
                      }
                      className={styles.quantityInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={`item-price-${index}`} className={styles.itemLabel}>
                      Preço
                    </label>
                    <input
                      id={`item-price-${index}`}
                      type="number"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          ...item,
                          price: e.target.value,
                        })
                      }
                      className={styles.priceInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={`item-total-${index}`} className={styles.itemLabel}>
                      Total
                    </label>
                    <input
                      id={`item-total-${index}`}
                      type="text"
                      value={calculateItemTotal(item.quantity, item.price)}
                      readOnly
                      className={styles.readOnlyInput}
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
              ))
            ) : (
              <p className={styles.noItemsMessage}>Nenhum item para este aluguel.</p>
            )}
          </ul>
        </div>

        {/* Total Geral */}
        <div className={styles.totalContainer}>
          <label className={styles.totalLabel}>Total Geral</label>
          <input
            type="text"
            value={`${formateNumber(calculateTotal())}`}
            readOnly
            className={styles.totalInput}
          />
        </div>

        <div style={{ margin: "0 auto" }}>
          <input type="submit" value="Atualizar" className={styles.btnSubmit} />
        </div>
      </form>
    </section>
  );
};

export default UpdateRent;
