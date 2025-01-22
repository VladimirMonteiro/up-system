import { useState } from 'react';
import styles from './CreateEarning.module.css'
import { handlePriceChange } from '../../utils/handlePriceChange';

const CreateEarning = ({rents, handleCreateEarning, errors}) => {

    const [rentId, setRentId] = useState('')
    const [price, setPrice] = useState('')
    const [dateOfEarn, setDateOfEarn] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        const newEarn = {
            rentId,
            price: parseFloat(price),
            dateOfEarn
        }

        try {
            
        const response = await handleCreateEarning(newEarn)
        
        if (!response) {
            setRentId('')
            setPrice('')
            setDateOfEarn('')
        }

        } catch (error) {
            console.log(error)
        }
     
    }

    console.log(rents)
    return (
        <div className={styles.mainContainer}>
            <h2>Adicionar ganho</h2>
            <form className={styles.containerForm} onSubmit={handleSubmit}>
                <div>
                    <select
                        name="rentId"
                        id="rent"
                        onChange={e => setRentId(e.target.value)}
                        value={rentId}
                    >
                        <option value="">Selecione uma locação</option>
                        {rents && rents.map((rent) => (
                            <option key={rent.id} value={rent.id}>
                                {rent.id} - {rent.client.name}
                            </option>
                        ))}
                    </select>
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("Locação"))}</p>
                    )}
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="price">Valor: </label>
                    <input type="text" placeholder="Valor..." id="price" name='price' onChange={e => handlePriceChange(e, setPrice)} value={price} />
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("valor"))}</p>
                    )}
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="dateOfEarn">Data pagamento: </label>
                    <input type="date" placeholder="Opcional" id="dateOfEarn" name='dateOfEarn' onChange={e => setDateOfEarn(e.target.value)} value={dateOfEarn} />
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("data"))}</p>
                    )}
                </div>

                <input type="submit" value="Adicionar" />
            </form>
        </div>
    )
}

export default CreateEarning;
