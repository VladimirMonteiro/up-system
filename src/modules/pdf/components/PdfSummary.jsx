import styles from '../styles/RentPdf.module.css';

const PdfSummary = ({ total, obs }) => {
  return (
    <section className={styles.summary}>
      <p><strong>Valor Total:</strong> R$ {total}</p>
      <p>Observação: {obs ? obs : "--"}</p>
    </section>
  );
};

export default PdfSummary;
 