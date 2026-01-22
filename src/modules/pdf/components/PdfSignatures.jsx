import styles from '../styles/RentPdf.module.css';

const PdfSignatures = () => {
  return (
    <section className={styles.signatureSection}>
      <div className={styles.signatureRow}>
        <div className={styles.signatureBox}>
          <p>Assinatura da Up Locações</p>
        </div>
        <div className={styles.signatureBox}>
          <p>Assinatura do Cliente</p>
        </div>
      </div>
    </section>
  );
};

export default PdfSignatures;
