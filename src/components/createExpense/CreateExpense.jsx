import { useState } from 'react';
import styles from '../createEarning/CreateEarning.module.css'

import { handlePriceChange } from '../../utils/handlePriceChange';

const CreateExpense = ({ handleCreateExpense, errors }) => {

    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [fixed, setFixed] = useState('')
    const [dateOfSpent, setDateOfSpent] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Extrai a data do campo de data (sem transformar para Date)
        const dateString = dateOfSpent; // Exemplo: "2025-01-20" (formato 'yyyy-MM-dd')

        // Verifica se a data tem o formato correto
        const dateArray = dateString.split("-"); // Dividir em [ano, mês, dia]

        // Verifica se a data é válida e tem o formato 'yyyy-MM-dd'

        const [year, month, day] = dateArray;

        // Agora, formata a data como 'dd/MM/yyyy' sem afetar o valor
        const formattedDate = `${day}/${month}/${year}`;
        console.log(formattedDate)

        // Atualiza o estado com a data formatada corretamente
        const newSpent = {
            description,
            value: parseFloat(value),
            fixed,
            dateOfSpent: formattedDate.startsWith('undefined/undefined/') ? '' : formattedDate
        }

        try {
            const response = (await (handleCreateExpense(newSpent)))

            if (!response) {
                setDescription('');
                setFixed('');
                setValue('');
                setDateOfSpent('');
            }



        } catch (error) {
            console.error("Erro ao criar gasto:", error);

        }



    }

    return (
        <div className={styles.mainContainer}>
            <h2>Adicionar gasto</h2>
            <form className={styles.containerForm} onSubmit={handleSubmit}>
                <div className={styles.containerInput}>
                    <label htmlFor="description">Descrição </label>
                    <input type="text" placeholder="Descrição..." id="description" name='description' onChange={e => setDescription(e.target.value)} value={description} />
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("descrição"))}</p>
                    )}
                </div>
                <div className={styles.containerInput}>
                    <label htmlFor="price">Valor: </label>
                    <input type="text" placeholder="Valor..." id="value" name='value' onChange={e => handlePriceChange(e, setValue)} value={value} />
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("valor"))}</p>
                    )}

                    <select name="fixed" id="fixed" onChange={e => setFixed(e.target.value)} value={fixed || ''}>
                        <option value=''>Selecione tipo de gasto</option>
                        <option value={'true'}>Fixo</option>
                        <option value={'false'}>Não fixo</option>
                    </select>
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("tipo"))}</p>
                    )}

                </div>
                <div className={styles.containerInput}>
                    <label htmlFor="dateOfEarn">Data pagamento: </label>
                    <input type="date" placeholder="Opcional" id="dateOfSpent" name='dateOfSpent' onChange={e => setDateOfSpent(e.target.value)} value={dateOfSpent} />
                    {errors && errors.length > 0 && (
                        <p style={{ color: "red", margin: '5px 0', fontSize: '15px' }}>{errors.filter(error => error.includes("data"))}</p>
                    )}
                </div>
                <input type="submit" value="Adicionar" />
            </form>
        </div>
    )
}

export default CreateExpense;
