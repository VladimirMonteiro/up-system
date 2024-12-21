import { useLocation } from 'react-router-dom';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import styles from './Pdf.module.css';

const options = {
  method: 'open',
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: 'A4',
    orientation: 'portrait',
  },
  canvas: {
    mimeType: 'image/jpeg',
    qualityRatio: 0.8,
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: false,
    },
  },
};

const PdfPage = () => {
  const location = useLocation();
  const { client, items, price, initialDate, deliveryDate } = location.state || {};

  const getTargetElement = () => document.getElementById('content-id');

  return (
    <div className={styles.containerPdf}>
      <div id="content-id" className={styles.content}>
        <div className={styles.header}>
          <h1>Up Locações</h1>
          <h2>Contrato de Locação</h2>
        </div>

        <div className={styles.clientInfo}>
          <p><strong>Cliente:</strong> {client?.name}</p>
          <p><strong>CPF:</strong> {client?.cpf}</p>
        </div>

        <div className={styles.itemsSection}>
          <h3>Itens Alugados:</h3>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items && items.map((item, index) => (
                <tr key={index}>
                  <td>{item.tool}</td>
                  <td>{item.quantity}</td>
                  <td>R${item.price}</td>
                  <td>R${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          <h3>Total de Locação: R${price}</h3>
          <p><strong>Data Inicial:</strong> {initialDate}</p>
          <p><strong>Data de Entrega:</strong> {deliveryDate}</p>
        </div>



        {/* Seções para Assinaturas */}
        <div className={styles.signatureSection}>
          <div className={styles.signatureRow}>
            <div className={styles.signatureBox}>
              <p><strong>Assinatura da Up Locações</strong></p>
            </div>

            <div className={styles.signatureBox}>
              <p><strong>Assinatura do Cliente</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.generateButtonContainer}>
        <button className={styles.generatePdfButton} onClick={() => generatePDF(getTargetElement, options)}>
          Gerar PDF
        </button>
      </div>
    </div>
  );
};

export default PdfPage;
