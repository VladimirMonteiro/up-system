import styles from '../../pages/admin/createRent/CreateRent.module.css';
import { handlePriceChange } from '../../utils/handlePriceChange';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CompleteRent = ({ client, tool, price, quantity, listItems }) => {
  const [initialDate, setInitalDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [obs, setObs] = useState('');
  const [freight, setFreight] = useState(0 || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const finishRent = async (e) => {
    e.preventDefault();

    if (!initialDate) {
      alert('Informe a data inicial da locação.');
      return;
    }

    if (!deliveryDate) {
      alert('Informe a data final da locação.');
      return;
    }

    const updatedListItems = listItems.map((item) => {
      const { tool, ...rest } = item;
      return rest;
    });

    const totalValue =
      updatedListItems.reduce((total, item) => total + item.price * item.quantity, 0) +
      (freight ? parseFloat(freight) : 0);

    if (isNaN(totalValue)) {
      alert('Algum valor da lista de locação não foi informado!');
      return;
    }

    const newRent = {
      client: {
        id: client.id,
        type: client.cnpj ? 'clientPJ' : 'clientFS',
      },
      items: updatedListItems,
      price: totalValue,
      initialDate,
      deliveryDate,
      obs,
      freight: freight ? parseFloat(freight) : 0,
    };

    setLoading(true);

    try {
      const response = await api.post('/rent/create', newRent, {
        responseType: 'blob',
      });

      // 🔥 Criar URL temporária para o PDF
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);

      // 👉 Abrir em nova aba
      window.open(fileURL);

      // 👉 Se quiser forçar download:
      /*
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `contrato-locacao-${client.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    */

      navigate('/alugueis');
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar contrato');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form
        onSubmit={finishRent}
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Finalizar Locação</h2>
        <div className={styles.dateInputContainer} style={{ margin: '0px auto' }}>
          <label htmlFor='initialDate'>Data inicial: </label>
          <input
            type='date'
            name='initialDate'
            id='initialDate'
            onChange={(e) => setInitalDate(e.target.value)}
            value={initialDate}
          />
        </div>
        <div className={styles.dateInputContainer} style={{ margin: '10px auto' }}>
          <label htmlFor='deliveryDate'>Data Final: </label>
          <input
            type='date'
            name='deliveryDate'
            id='deliveryDate'
            onChange={(e) => setDeliveryDate(e.target.value)}
            value={deliveryDate}
          />
        </div>
        <div className={styles.inputContainer2} style={{ margin: '10px auto' }}>
          <label htmlFor='freight'>Frete</label>
          <input
            type='text'
            name='freight'
            id='freight'
            placeholder='Opcional'
            onChange={(e) => handlePriceChange(e, setFreight)}
            value={freight || ''}
          />
        </div>
        <div className={styles.textareaContainer}>
          <textarea
            className={styles.textareaInput}
            placeholder='Observação (Opcional)'
            onChange={(e) => setObs(e.target.value)}
            value={obs || ''}
          ></textarea>
        </div>
        <div className={styles.inputContainer2} style={{ margin: '10px auto' }}>
          <input type='submit' value={loading ? 'Finalizando...' : 'Finalizar locação'} />
        </div>
      </form>
    </div>
  );
};

export default CompleteRent;
