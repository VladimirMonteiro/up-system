import { useLocation } from "react-router-dom";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import styles from "./Pdf.module.css";
import { formateNumber } from "../../utils/formatNumber";
import LocData from "./LocData";

const options = {
  method: "open",
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: "A4",
    orientation: "portrait",
  },
  canvas: {
    mimeType: "image/jpeg",
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
  const { client, items, price, freight, obs, initialDate, deliveryDate } =
    location.state || {};

  const getTargetElement = () => document.getElementById("content-id");

  console.log(client);

  return (
    <div className={styles.containerPdf}>
      <div id="content-id" className={styles.content}>
        <div className={styles.header}>
          <h1>Up Locações</h1>
          <h2>Contrato de Locação</h2>
        </div>

        <LocData
          title={"Contrato de Locação DADOS DO LOCADOR"}
          name={"Up Locações de equipamentos LTDA"}
          cpfOrCnpj={"40.094.239/0001-92"}
          address={"Avenida Presidente Vargas, Nº 3630"}
          neighborhood={"Centro"}
          city={"Esteio"}
          state={"RS"}
          phone={"(51) 99913-4363"}
          email={"uplocacoes.rs@gmail.com"}
        />

        <LocData
          title={"Dados do Locatário"}
          name={client?.name}
          cpfOrCnpj={client.cpf ? client.cpf : client.cnpj}
          address={
            client.addresses[0].street + ", Nº " + client.addresses[0].number
          }
          neighborhood={client.addresses[0].neighborhood}
          city={client.addresses[0].city}
          state={client.addresses[0].state}
          phone={client.phones[0]}
          email={client.email}
        />

        <p style={{ fontWeight: 'bold' }}>PERIODO DE LOCAÇÃO</p>
        <div className={styles.line5}>

          <div>
            <span>Inicio: </span>
            <p>{initialDate}</p>
          </div>
          <div>
            <span>Até: </span>
            <p>{deliveryDate}</p>
          </div>
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
              {items &&
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.tool || item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formateNumber(item.price)}</td>
                    <td>{formateNumber(item.price * item.quantity)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          <h3>Total de Locação: {formateNumber(price)}</h3>
          <p>Frete: {formateNumber(freight || 0)}</p>
          <p>Observação: {obs}</p>
        </div>
        <div className={styles.containerClausulas}>
          <h2>Cláusulas contratais</h2>
          <h3>
            CONTRATO DE LOCAÇÃO DE EQUIPAMENTO PARA CONSTRUÇÃO CIVIL CONTRATO
            PARA LOCAÇÃO DE PRAZO DETERMINADO.
          </h3>
          <p>
            As partes acima têm, entre si, justas e acertadas o presente
            contrato para locação de equipamentos para construção civil de prazo
            determinado, que se regerá pelas cláusulas seguintes e pelas
            condições descritas no presente.
          </p>
          <ul>
            <li>
              Cláusula 1ª: O presente contrato tem como objeto a locação de
              equipamento para construção civil, conforme descrito.
            </li>
            <li>
              Cláusula 2ª: O equipamento, objeto deste contrato, será utilizado
              exclusivamente pelo locatário, não sendo permitido o seu uso por
              terceiros sob pena de rescisão contratual.
            </li>{" "}
            <li>
              Cláusula 3ª: O Locatário pagará à locadora a quantia relacionada
              no documento em razão do aluguel do equipamento. Este pagamento
              será realizado no vencimento especificado.
            </li>{" "}
            <li>
              Cláusula 4ª: O locatário deverá devolver o equipamento à locadora
              nas mesmas condições em que estava quando recebeu, respondendo
              pelos danos ou prejuízos causados.
            </li>{" "}
            <li>
              Cláusula 5ª: A presente locação terá o lapso temporal de validade
              especificado neste documento e terminando na data especificada,
              data na qual o equipamento deverá ser devolvido.
            </li>
            <li>
              Clausula 6ª: O descumprimento de qualquer cláusula por partes dos
              contratantes enseja a rescisão deste instrumento e o devido
              pagamento pela parte.
            </li>
            <li>
              Clausula 7ª E por estarem de acordo com todas as cláusulas, firmam
              o presente instrumento, por si e eventuais sucessores, em duas (2)
              vias de igual teor, para um só efeito, com vigência a partir da
              data de sua assinatura.
            </li>
          </ul>
        </div>

        {/* Seções para Assinaturas */}
        <div className={styles.signatureSection}>
          <div className={styles.signatureRow}>
            <div className={styles.signatureBox}>
              <p>
                <strong>Locador <br /></strong>
                <strong>Assinatura da Up Locações<br /></strong>
                <strong>CPF/CNPJ: 40.094.239/0001-92</strong>
              </p>
            </div>

            <div className={styles.signatureBox}>
              <p>
                <strong>Locatário <br /></strong>
                <strong>Assinatura {client.name}<br /></strong>
                <strong>CPF/CNPJ: {client.cpf ? client.cpf : client.cnpj}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.generateButtonContainer}>
        <button
          className={styles.generatePdfButton}
          onClick={() => generatePDF(getTargetElement, options)}
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
};

export default PdfPage;
