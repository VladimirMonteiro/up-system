import { useState, useEffect } from 'react'
import { handlePriceChange } from '../../utils/handlePriceChange'
import styles from './UpdateTool.module.css'


const UpdateTool = ({ tool, errors, handleUpdate }) => {
    const [name, setName] = useState("");
    const [totalQuantity, setTotalQuantity] = useState("")
    const [quantity, setQuantity] = useState("");
    const [daily, setDaily] = useState("");
    const [week, setWeek] = useState("");
    const [biweekly, setBiweekly] = useState("")
    const [twentyOneDays, setTwentyOneDays] = useState("")
    const [priceMonth, setPriceMonth] = useState("");

    // Atualizar os estados quando `tool` mudar
    useEffect(() => {
        if (tool) {
            setName(tool.name || "");
            setTotalQuantity(tool.totalQuantity || "")
            setQuantity(tool.quantity || "");
            setDaily(tool.daily || "");
            setWeek(tool.week || "");
            setBiweekly(tool.biweekly || "");
            setTwentyOneDays(tool.twentyOneDays);
            setPriceMonth(tool.priceMonth || "");
        }
    }, [tool]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateTool = {
            name,
            totalQuantity: parseFloat(totalQuantity),
            quantity: parseFloat(quantity),
            daily: parseFloat(String(daily).replace(/\./g, '').replace(',', '.')),
            week: parseFloat(String(week).replace(/\./g, '').replace(',', '.')),
            biweekly: parseFloat(String(biweekly).replace(/\./g, '').replace(',', '.')),
            twentyOneDays: parseFloat(String(twentyOneDays).replace(/\./g, '').replace(',', '.')),
            priceMonth: parseFloat(String(priceMonth).replace(/\./g, '').replace(',', '.')),
        };

        await handleUpdate(tool.id, updateTool)


    };


    return (
        <div>
            <h2>Atualização de ferramenta</h2>
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
                        <label htmlFor="totalQuantity">Quantidade total</label>
                        <input type="text" name="totalQuantity" id="totalQuantity" onChange={(e) => setTotalQuantity(e.target.value)} value={totalQuantity} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("quantidade total"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="quantity">Quantidade disponível</label>
                        <input type="text" name="quantity" id="quantity" onChange={(e) => setQuantity(e.target.value)} value={quantity} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.find(error => error.toLowerCase().includes("a quantidade é"))}</p>
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
                        <label htmlFor="week">Valor quinzena (15)</label>
                        <input type="text" name='biweekly' id='biweekly' onChange={(e) => handlePriceChange(e, setBiweekly)} value={biweekly} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("quinzena"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="week">Valor 3 semanas (21)</label>
                        <input type="text" name='twentyOneDays' id='twentyOneDays' onChange={(e) => handlePriceChange(e, setTwentyOneDays)} value={twentyOneDays} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("21 dias"))}</p>
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