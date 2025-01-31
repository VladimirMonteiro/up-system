import styles from '../../pages/admin/createRent/CreateRent.module.css';
import { handlePriceChange } from "../../utils/handlePriceChange";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const CompleteRent = ({ client, tool, price, quantity, listItems }) => {
  const [initialDate, setInitalDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [obs, setObs] = useState('')
  const [freight, setFreight] = useState(0 || null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const finishRent = async (e) => {
    e.preventDefault();

    if(!initialDate) {
      alert('Informe a data inicial da locação.')
      return
    }

    if(!deliveryDate) {
      alert('Informe a data final da locação.')
      return
    }

    const updatedListItems = listItems.map((item) => {
      // eslint-disable-next-line no-unused-vars
      const { tool, ...rest } = item; // Desestrutura para remover 'tool'
      return rest; // Retorna o objeto sem a chave 'tool'
    });

    const dataRentToPdf = {
      client,
      items: listItems,
      price: (
        listItems.reduce((total, item) => total + item.price * item.quantity, 0) 
        + parseFloat(freight)
      ).toFixed(2), // Convertendo para 2 casas decimais após a soma
      initialDate,
      deliveryDate,
      obs,
      freight: parseFloat(freight)
    };

    const newRent = {
      client,
      items: updatedListItems,
      price: (
        listItems.reduce((total, item) => total + item.price * item.quantity, 0) 
        + parseFloat(freight)
      ).toFixed(2),
      initialDate,
      deliveryDate,
      obs,
      freight: parseFloat(freight)
    };
    

    console.log(price)

    setLoading(true)

    try {
      const request = await api.post(
        "/rent/create",
        newRent
      );
      console.log(request.data);
      setLoading(false)

      navigate("/pdf", { state: dataRentToPdf });
    } catch (error) {
      alert(error);
    }

    console.log(newRent);
  };
  return (
    <div>
      <form onSubmit={finishRent} style={{display:'flex', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
        <h2 style={{marginBottom: '20px', textAlign: 'center'}}>Finalizar Locação</h2>
        <div className={styles.dateInputContainer} style={{margin: '0px auto'}}>
          <label htmlFor="initialDate">Data inicial: </label>
          <input
            type="date"
            name="initialDate"
            id="initialDate"
            onChange={(e) => setInitalDate(e.target.value)}
            value={initialDate}
          />
        </div>
        <div className={styles.dateInputContainer} style={{margin: '10px auto'}}>
          <label htmlFor="deliveryDate">Data Final: </label>
          <input
            type="date"
            name="deliveryDate"
            id="deliveryDate"
            onChange={(e) => setDeliveryDate(e.target.value)}
            value={deliveryDate}
          />
        </div>
        <div className={styles.inputContainer2} style={{margin: '10px auto'}}>
            <label htmlFor="freight">Frete</label>
            <input type="text" name="freight" id="freight" placeholder="Opcional" onChange={(e) => handlePriceChange(e, setFreight)} value={freight || ""} />
        </div>
        <div className={styles.textareaContainer}>
      <textarea className={styles.textareaInput} placeholder="Observação (Opcional)" onChange={e => setObs(e.target.value)} value={obs || ""}></textarea>
    </div>
        <div className={styles.inputContainer2} style={{margin: '10px auto'}}>
          <input type="submit" value= {loading ? "Finalizando..." : "Finalizar locação"}/>
        </div>
      </form>
    </div>
  );
};

export default CompleteRent;
