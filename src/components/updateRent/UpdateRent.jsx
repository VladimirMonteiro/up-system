import { useState, useEffect } from 'react';
import styles from './UpdateRent.module.css'; // Importando o CSS Module
import api from '../../utils/api';
import { handlePriceChange } from '../../utils/handlePriceChange';

const UpdateRent = ({ rent }) => {
    const [client, setClient] = useState({});
    const [listItems, setListItems] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false); // Estado para o checkbox

    useEffect(() => {
        if (rent) {
            setClient(rent.client || {});
            setListItems(rent.rentItems || []);
            setIsCompleted(rent.stateRent === 'PAID');
        }

    }, [rent]);

    const handleUpdateItem = (index, updatedItem) => {
        const updatedList = [...listItems];
        updatedList[index] = updatedItem;
        setListItems(updatedList);
    };

    const handleDeleteItem = async (index) => {
        const updatedList = listItems.filter((_, i) => i !== index);
        setListItems(updatedList);
    };

    const handleCheckboxChange = () => {
        setIsCompleted(!isCompleted); // Alterna entre finalizado e não finalizado
    };

    const handleUpdateRent = async(e) => {
        e.preventDefault()

        const updatedRent = {
            id: rent.id,
            items: listItems,
            stateRent: isCompleted ? 'PAID' : 'PENDENT'
        }

        try {
            const response = await api.put(`/rent/update/${rent.id}`, updatedRent)
            console.log(response.data)
            
        } catch (error) {
            console.log(error)
        }

        console.log(updatedRent)

    }

    return (
        <section className={styles.updateRentSection}>
            <h2 className={styles.updateRentTitle}>Atualizar Locação</h2>
            <form className={styles.updateRentForm} onSubmit={handleUpdateRent}>
                <div>
                    <div className={styles.inputContainer2}>
                        <label htmlFor="clientSelect" className={styles.formLabel}>Cliente</label>
                        <input type="text" name='client' id='client' disabled value={client.name || ""} />
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="completed"
                            checked={isCompleted}
                            onChange={handleCheckboxChange}
                            className={styles.checkboxInput}
                        />
                        <label htmlFor="completed" className={styles.checkboxLabel}>Finalizado</label>
                    </div>


                </div>


                <div className={styles.formGroup}>
                    <label htmlFor="rentItems" className={styles.formLabel}>Itens da Locação</label>
                    <ul className={styles.rentItemsList}>
                        {listItems.length > 0 ? (
                            listItems.map((item, index) => (
                                <li key={index} className={styles.rentItem}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor={`name`} className={styles.itemLabel}>Nome</label>
                                        <input
                                            id={`item-name-${index}`}
                                            type="text"
                                            value={item.tool.name || ""}
                                            readOnly
                                            className={styles.readOnlyInput}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor={`item-quantity-${index}`} className={styles.itemLabel}>Quantidade</label>
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
                                        <label htmlFor={`item-price-${index}`} className={styles.itemLabel}>Preço</label>
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

                <div style={{ margin: "0 auto" }}>
                    <input type="submit" value="Atualizar" className={styles.btnSubmit} />
                </div>

            </form>
        </section>
    );
};

export default UpdateRent;
