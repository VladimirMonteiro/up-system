import { useLocation } from "react-router-dom";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import styles from "./Pdf.module.css";
import { formateNumber } from "../../utils/formatNumber";
import LocData from "./LocData";
import logo_up from "../../assets/logo_up.png";

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
  const { client, rentId, items, price, freight, obs, initialDate, deliveryDate } =
    location.state || {};

  const getTargetElement = () => document.getElementById("content-id");

  console.log(initialDate)
  console.log(deliveryDate)

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Function to get the month name based on the number (1 to 12)
  function getMonthName(monthNumber) {
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1]; // Array is 0-indexed, so subtract 1
    } else {
      return "Mês inválido"; // Return an error message if the month number is invalid
    }
  }

  function dateFormatter(date) {
    const newDate = new Date(date)
    return new Intl.DateTimeFormat('pt-BR', {dateStyle: 'short'}).format(newDate)

  }
  
  return (
    <div className={styles.containerPdf}>
      <div id="content-id" className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerDiv}>
            <div className={styles.imageContainer}>
              <img src={logo_up} alt="up locacoes"></img>
            </div>
            <div className={styles.idRent}>
              Número do contrato: Nº {rentId ? rentId : items[0].rent}
            </div>
          </div>
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

        <p style={{ fontWeight: "bold" }}>PERIODO DE LOCAÇÃO</p>
        <div className={styles.line5}>
          <div>
            <span>Inicio: </span>
            <p>{rentId ? dateFormatter(initialDate) : initialDate}</p>
          </div>
          <div>
            <span>Até: </span>
            <p>{rentId ? dateFormatter(deliveryDate) : deliveryDate}</p>
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
              <>
                {items &&
                  items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.tool || item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formateNumber(item.price)}</td>
                      <td>{formateNumber(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                <tr>
                  <td
                    style={{ backgroundColor: "transparent", border: "none" }}
                  ></td>
                  <td
                    style={{ backgroundColor: "transparent", border: "none" }}
                  ></td>
                  <td
                    style={{ backgroundColor: "transparent", border: "none" }}
                  ></td>
                  <td>
                    <span style={{ fontWeight: "bold" }}>Frete: </span>
                    {formateNumber(freight || 0)}
                  </td>
                </tr>
              </>
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          <h3>Total de Locação: {formateNumber(price)}</h3>
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

        <div style={{marginTop: "20px"}}>
          <p style={{fontWeight: "bold"}}>
            Esteio, {dateFormatter(initialDate).split("/")[0]} de{" "}
            {getMonthName(dateFormatter(initialDate).split("/")[1])}.
          </p>
        </div>

        {/* Seções para Assinaturas */}
        <div className={styles.signatureSection}>
          <div className={styles.signatureRow}>
            <div className={styles.signatureBox}>
              <p>
                <strong>
                  Locador <br />
                </strong>
                <strong>
                  Assinatura da Up Locações
                  <br />
                </strong>
                <strong>CPF/CNPJ: 40.094.239/0001-92</strong>
              </p>
            </div>
            <div className={styles.signatureBox}>
              <p>
                <strong>
                  Locatário <br />
                </strong>
                <strong>
                  Assinatura {client.name}
                  <br />
                </strong>
                <strong>
                  CPF/CNPJ: {client.cpf ? client.cpf : client.cnpj}
                </strong>
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
