import generatePDF from 'react-to-pdf';
import { pdfOptions } from '../utils/pdfOptions';
import styles from '../styles/RentPdf.module.css';

const PdfLayout = ({ children }) => {
  const getTargetElement = () => document.getElementById('pdf-content');

  return (
    <>
      <div className={styles.generateButtonContainer}>
        <button
          className={styles.generatePdfButton}
          onClick={() => generatePDF(getTargetElement, pdfOptions)}
        >
          Gerar PDF
        </button>
      </div>

      <div className={styles.containerPdf}>
        <div id="pdf-content" className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PdfLayout;
