import styles from '../styles/RentPdf.module.css';

const PdfPeriod = ({ initialDate, deliveryDate }) => (
  <>
    <p style={{ fontWeight: 'bold' }}>PERIODO DE LOCAÇÃO</p>
    <section className={styles.line5}>
      <div>
        <span>Inicio: </span>
        <p>{initialDate}</p>
      </div>
      <div>
        <span>Até: </span>
        <p>{deliveryDate}</p>
      </div>
    </section>
  </>
);

export default PdfPeriod;
