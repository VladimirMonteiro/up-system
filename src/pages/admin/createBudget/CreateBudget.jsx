// src/components/NewBudget.js
import { useState } from 'react';
import styles from './CreateBudget.module.css';
import { FiTrash } from 'react-icons/fi';

import QuotationSummary from './QuotationSummary';
import Navbar from '../../../components/navbar/Navbar';
import Modal from '../../../components/modal/Modal';
import TableTools from '../../../components/tableTools/TableTools';
import Table from '../../../components/tableClients/Table';

const formatCurrency = (value) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = (Number(value) / 100).toFixed(2);
  value = value.replace('.', ',');
  return 'R$ ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const currencyToNumber = (masked) => {
  if (!masked) return 0;
  return Number(masked.replace(/\D/g, '')) / 100;
};

const formatNumber = (value) => {
  return value.replace(/\D/g, '');
};

const NewBudget = () => {
  const [isToolModalOpen, setToolModalOpen] = useState(false);
  const [isClientModalOpen, setClientModalOpen] = useState(false);

  const [tools, setTools] = useState([]);
  const [client, setClient] = useState({});

  const [discount, setDiscount] = useState('');
  const [freight, setFreight] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSelectClient = (c) => {
    setClient(c);
    setClientModalOpen(false);
  };

  const handleSelectTool = (tool) => {
    setTools((prev) => [
      ...prev,
      {
        ...tool,
        priceMasked: '',
        quantityMasked: '1',
        price: 0,
        quantity: 1,
        subtotal: 0,
      },
    ]);

    setToolModalOpen(false);
  };

  const handleRemoveItem = (id) => {
    setTools((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setTools((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let masked = value;
        let numericValue = 0;

        if (field === 'priceMasked') {
          masked = formatCurrency(value);
          numericValue = currencyToNumber(masked);
          item.price = numericValue;
          item.priceMasked = masked;
        }

        if (field === 'quantityMasked') {
          masked = formatNumber(value);
          numericValue = Number(masked || 1);
          item.quantity = numericValue;
          item.quantityMasked = masked;
        }

        item.subtotal = item.price * item.quantity;
        return { ...item };
      }),
    );
  };

  const calculateTotals = () => {
    const subtotal = tools.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);

    return {
      subtotal,
      total: subtotal - currencyToNumber(discount) + currencyToNumber(freight),
      totalDiscount: currencyToNumber(discount),
      freight: currencyToNumber(freight),
    };
  };

  const totals = calculateTotals();

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <h2 className={styles.title}>NOVO ORÇAMENTO DE LOCAÇÃO</h2>
        </header>

        <div className={styles.workspace}>
          <section className={styles.quotationForm}>
            <div className={styles.panel}>
              <h3>DADOS PRINCIPAIS</h3>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Cliente</label>
                  <input
                    type='text'
                    placeholder='Selecionar cliente'
                    onClick={() => setClientModalOpen(true)}
                    value={client.name || ''}
                    readOnly
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Desconto (R$)</label>
                  <input
                    value={discount}
                    onChange={(e) => setDiscount(formatCurrency(e.target.value))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Frete (R$)</label>
                  <input
                    value={freight}
                    onChange={(e) => setFreight(formatCurrency(e.target.value))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Início Locação</label>
                  <input id='initialDate' type='date' defaultValue={today} />
                </div>

                <div className={styles.formGroup}>
                  <label>Fim Previsto</label>
                  <input id='deliveryDate' type='date' />
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h3>ITENS DO ORÇAMENTO</h3>

              <button className={styles.btnAddItem} onClick={() => setToolModalOpen(true)}>
                + Adicionar Equipamento
              </button>

              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Preço</th>
                    <th>Qtd</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {tools.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>

                      <td>
                        <input
                          value={item.priceMasked}
                          onChange={(e) => updateItem(item.id, 'priceMasked', e.target.value)}
                        />
                      </td>

                      <td>
                        <input
                          value={item.quantityMasked}
                          onChange={(e) => updateItem(item.id, 'quantityMasked', e.target.value)}
                        />
                      </td>

                      <td>R$ {item.subtotal.toFixed(2)}</td>

                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.panel}>
              <h3>Observações</h3>
              <textarea id='obs' rows='3'></textarea>
            </div>
          </section>

          <QuotationSummary
            totals={totals}
            client={client}
            tools={tools}
            discount={currencyToNumber(discount)}
            freight={currencyToNumber(freight)}
          />
        </div>
      </main>

      <Modal isOpen={isToolModalOpen} onClose={() => setToolModalOpen(false)}>
        <h2>Selecione uma Ferramenta</h2>
        <TableTools selected={handleSelectTool} />
      </Modal>

      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)}>
        <h2>Selecione um Cliente</h2>
        <Table selected={handleSelectClient} />
      </Modal>
    </div>
  );
};

export default NewBudget;
