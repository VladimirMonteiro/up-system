import styles from '../styles/RentPdf.module.css';

const PdfItemsTable = ({ items = [], freight = 0 }) => {
  const totalItems = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className={styles.itemsSection}>
      <h3>Itens Locados</h3>

      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th>Ferramenta</th>
            <th>Qtd</th>
            <th>Valor</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.tool?.name || item.name}</td>
              <td>{item.quantity}</td>
              <td>R$ {item.price}</td>
              <td>R$ {item.price * item.quantity}</td>
            </tr>
          ))}

          <tr>
            <td colSpan={3}>Frete</td>
            <td>R$ {freight}</td>
          </tr>

          <tr>
            <td colSpan={3}><strong>Total</strong></td>
            <td><strong>R$ {totalItems + freight}</strong></td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default PdfItemsTable;

