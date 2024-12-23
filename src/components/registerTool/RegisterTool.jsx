import { useState } from 'react'
import { handlePriceChange } from '../../utils/handlePriceChange'
import styles from './RegisterTool.module.css'
import api from '../../utils/api'

const RegisterTool = () => {


    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [daily, setDaily] = useState("")
    const [week, setWeek] = useState("")
    const [priceMonth, setPriceMonth] = useState("")
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const newTool = {
            name,
            quantity: parseFloat(quantity),
            daily: parseFloat(daily.replace(/\./g, '').replace(',', '.')),
            week: parseFloat(week.replace(/\./g, '').replace(',', '.')),
            priceMonth: parseFloat(priceMonth.replace(/\./g, '').replace(',', '.'))
        }

        try {

            const response = await api.post("http://localhost:8080/tools/create", newTool)
            console.log(response.data)
            setSuccess(response.data.message)

            setTimeout(() => {
                setSuccess(null)

            }, 3000)

            setName("")
            setQuantity("")
            setDaily("")
            setWeek("")
            setPriceMonth("")
            
            return response.data

            
            
        } catch (error) {
            console.log(error)
            setErrors(error.response.data.errors)
        }
    }



    return (
        <div>
            <h2>Cadastro de ferramenta</h2>
            {success && <p style={{color: "#28a745", textAlign: "center"}}> {success}</p>}
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.form}>

                    <div className={styles.inputContainer}>
                        <label htmlFor="name">Nome</label>
                        <input type="text" name='name' id='name' onChange={e => setName(e.target.value)}  value={name}/>
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("nome"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="quantity">Quantidade</label>
                        <input type="text" name='quantity' id='quantity' onChange={e => setQuantity(e.target.value)} value={quantity} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("quantidade"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="daily">Diária</label>
                        <input type="text" name='daily' id='daily' onChange={(e) => handlePriceChange(e, setDaily)} value={daily}/>
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("diária"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="week">Semanal</label>
                        <input type="text" name='week' id='week' onChange={(e) => handlePriceChange(e, setWeek)} value={week} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("semanal"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="priceMonth">Mensal</label>
                        <input type="text" name='priceMonth' id='priceMonth' onChange={(e) => handlePriceChange(e, setPriceMonth)} value={priceMonth} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("mensal"))}</p>
                        )}
                    </div>

                </div>
                <div className={styles.containerBtn}>
                    
                    <div className={styles.inputContainer}>
                        <input type="submit" value="Cadastrar" />
                    </div>
                </div>
            </form>

        </div>
    )
}

export default RegisterTool