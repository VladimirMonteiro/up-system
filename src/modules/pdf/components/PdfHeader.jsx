import styles from '../styles/RentPdf.module.css';
import logo from '../../../assets/logoBlackUp.png';

const PdfHeader = ({ rent }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerDiv}>
        <div className={styles.imageContainer}>
          <img src={logo} alt='Up Locações' />
        </div>

        <div className={styles.idRent}>
          <span className={styles.idRent}> Número do contrato: Nº {rent.rentId ?? '-'}</span>
        </div>
      </div>
      <h2>Contrato de Locação</h2>
    </header>
  );
};

export default PdfHeader;
