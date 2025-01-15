import { useEffect, useState } from 'react';
import styles from './CreateEarning.module.css'
import api from '../../utils/api';

const CreateEarning = () => {

    const [earn, setEarn] = useState({
        rentId: '', // Definindo uma propriedade para armazenar o rent.id selecionado
        price: '',
        dateOfEarn: '',
    })
    const [rents, setRents] = useState([])


    useEffect(() => {
        const request = async () => {
            try {
                const response = await api.get(`/rent`)
                console.log(response.data)
                setRents(response.data.filter(rent => rent.stateRent === 'PENDENT'))
            } catch (error) {
                console.log(error)
            }
        }

        request()
    }, [])



    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setEarn(prevEarn => ({
            ...prevEarn,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault()


        if(!earn.rentId) {
            alert("É necessário selecionar uma locação.")
            return
        }

        if(!earn.price) {
            alert("É necessário informar o valor do pagamento.")
            return
        }

        try {
            const response = await api.post(`earning/create`, earn)
            console.log(response.data)

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
                        onChange={handleOnChange}  
                        value={earn.rentId}
                    >
                        <option value="">Selecione uma locação</option>
                        {rents && rents.map((rent) => (
                            <option key={rent.id} value={rent.id}>
                                {rent.id} - {rent.client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="price">Valor: </label>
                    <input type="text" placeholder="Valor..." id="price" name='price' onChange={handleOnChange} value={earn.price} />
                </div>

                <div className={styles.containerInput}>
                    <label htmlFor="dateOfEarn">Data pagamento: </label>
                    <input type="date" placeholder="Opcional" id="dateOfEarn" name='dateOfEarn' onChange={handleOnChange} value={earn.dateOfEarn} />
                </div>

                <input type="submit" value="Adicionar" />
            </form>
        </div>
    )
}

export default CreateEarning;
