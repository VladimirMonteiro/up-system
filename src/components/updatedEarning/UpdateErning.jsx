import { handlePriceChange } from '../../utils/handlePriceChange';
import styles from './UpdateEarning.module.css';
import { useState, useEffect } from 'react';

const UpdateEarning = ({ earn, rents, errors, handleUpdatedEarn}) => {

    const [rentId, setRentId] = useState('');
    const [price, setPrice] = useState('');
    const [dateOfEarn, setDateOfEarn] = useState('');

    useEffect(() => {
        if (earn && earn.rent) {
            setRentId(earn.rent.id || "");
            setPrice(earn.price || "");
            setDateOfEarn(earn.dateOfEarn || "");
        }
    }, [earn]);

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const updatedEarn = {
            id: earn.id,
            rentId,
            price: parseFloat(price),
            dateOfEarn
        }
       await handleUpdatedEarn(earn.earningId, updatedEarn)
    }

    return (
        <div className={styles.mainContainer}>
            <h2>Atualizar Ganho</h2>
            <form className={styles.containerForm} onSubmit={handleSubmit}>
                <div className={styles.selectContainer}>
                    <select
                        name="rentId"
                        id="rent"
                        onChange={e => setRentId(e.target.value)}
                        value={rentId}
                        className={styles.select}
                    >
                        <option value="">Selecione uma locação</option>
                        {rents && rents.map((rent) => (
                            <option key={rent.id} value={rent.id}>
                                {rent.id} - {rent.client.name}
                            </option>
                        ))}
                    </select>
                    {errors && errors.length > 0 && (
                        <p className={styles.errorMessage}>{errors.filter(error => error.includes("Locação"))}</p>
                    )}
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="price">Valor: </label>
                    <input
                        type="text"
                        placeholder="Valor..."
                        id="price"
                        name='price'
                        onChange={e => handlePriceChange(e, setPrice)}
                        value={price}
                        className={styles.input}
                    />
                    {errors && errors.length > 0 && (
                        <p className={styles.errorMessage}>{errors.filter(error => error.includes("valor"))}</p>
                    )}
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="dateOfEarn">Data pagamento: </label>
                    <input
                        type="date"
                        placeholder="Opcional"
                        id="dateOfEarn"
                        name='dateOfEarn'
                        onChange={e => setDateOfEarn(e.target.value)}
                        value={dateOfEarn}
                        className={styles.input}
                    />
                    {errors && errors.length > 0 && (
                        <p className={styles.errorMessage}>{errors.filter(error => error.includes("data"))}</p>
                    )}
                </div>

                <input type="submit" value="Adicionar" className={styles.submitButton} />
            </form>
        </div>
    );
};

export default UpdateEarning;
