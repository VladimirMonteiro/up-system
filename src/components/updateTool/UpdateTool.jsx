import { useState, useEffect } from 'react'
import { handlePriceChange } from '../../utils/handlePriceChange'
import styles from './UpdateTool.module.css'
import api from '../../utils/api'

const UpdateTool = ({ tool }) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [daily, setDaily] = useState("");
    const [week, setWeek] = useState("");
    const [priceMonth, setPriceMonth] = useState("");
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(null);

    // Atualizar os estados quando `tool` mudar
    useEffect(() => {
        if (tool) {
            setName(tool.name || "");
            setQuantity(tool.quantity || "");
            setDaily(tool.daily || "");
            setWeek(tool.week || "");
            setPriceMonth(tool.priceMonth || "");
        }
    }, [tool]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updateTool = {
            name,
            quantity: parseFloat(quantity),
            daily: parseFloat(String(daily).replace(/\./g, '').replace(',', '.')),
            week: parseFloat(String(week).replace(/\./g, '').replace(',', '.')),
            priceMonth: parseFloat(String(priceMonth).replace(/\./g, '').replace(',', '.')),
        };
    
        try {
            const response = await api.put(`http://localhost:8080/tools/update/${tool.id}`, updateTool);
            console.log(response.data)
            setSuccess(response.data.message);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setErrors(error.response?.data?.errors || ["Erro ao atualizar ferramenta."]);
        }
    };


    return (
        <div>
            <h2>Atualização de ferramenta</h2>
            {success && <p style={{ color: "#28a745", textAlign: "center" }}>{success}</p>}
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="name">Nome</label>
                        <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("nome"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="quantity">Quantidade</label>
                        <input type="text" name="quantity" id="quantity" onChange={(e) => setQuantity(e.target.value)} value={quantity} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("quantidade"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="daily">Diária</label>
                        <input type="text" name="daily" id="daily" onChange={(e) => handlePriceChange(e, setDaily)} value={daily} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("diária"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="week">Semanal</label>
                        <input type="text" name="week" id="week" onChange={(e) => handlePriceChange(e, setWeek)} value={week} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("semanal"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="priceMonth">Mensal</label>
                        <input type="text" name="priceMonth" id="priceMonth" onChange={(e) => handlePriceChange(e, setPriceMonth)} value={priceMonth} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("mensal"))}</p>
                        )}
                    </div>
                </div>
                <div className={styles.containerBtn}>
                    <div className={styles.inputContainer}>
                        <input type="submit" value="Atualizar" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateTool;