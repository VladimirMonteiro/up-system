import { useLocation } from "react-router-dom";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import styles from "./Pdf.module.css";
import { formateNumber } from "../../utils/formatNumber";
import stylesTable from '../tableClients/Table.module.css'

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

const ReportPDF = () => {

    const location = useLocation();
    const { reportData, reportDataSpent, selectedMonth, selectedYear } = location.state || {};

    const getTargetElement = () => document.getElementById("content-id");
    console.log(reportDataSpent)

    if (!reportData && !reportDataSpent) {
        return <div>No data available for this report errad.</div>;
    }

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Function to get the month name based on the number (1 to 12)
    function getMonthName(monthNumber) {
        if (monthNumber >= 1 && monthNumber <= 12) {
            return months[monthNumber - 1]; // Array is 0-indexed, so subtract 1
        } else {
            return "Mês inválido"; // Return an error message if the month number is invalid
        }
    }

    return (


        <div className={styles.containerPdf}>
            <div id="content-id" className={styles.content}>
                <h1 style={{ textAlign: "center", margin: "30px 0" }}>{reportData ? "Relatório de faturamento" : "Relatório de gastos "}{selectedMonth + "/" + selectedYear}</h1>
                <table className={stylesTable.table}>
                    <thead>
                        {reportData && (
                            <tr>
                                <th>ID Locação</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Data pagamento</th>
                            </tr>
                        )}
                        {reportDataSpent && (
                            <tr>
                                <th>ID</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Data de pagamento</th>
                            </tr>
                        )}

                    </thead>
                    <tbody>
                        {reportData && reportData.map((row) => (
                            <tr
                                key={row.earningId}
                                onClick={location === "/alugar" ? () => selected(row) : undefined}
                                style={row.quantity === 0 ? { backgroundColor: '#ffcccc' } : {}}
                            >
                                <td>{row.rent.id}</td>
                                <td>{row.rent.client.name}</td>
                                <td>{formateNumber(row.price)}</td>
                                <td>{row.dateOfEarn}</td>
                            </tr>
                        ))}
                        {reportDataSpent && reportDataSpent.map((row) => (
                            <tr
                                key={row.id}
                                onClick={location === "/alugar" ? () => selected(row) : undefined}
                                style={row.fixed === true ? { backgroundColor: '#ffccc' } : {}}
                            >
                                <td>{row.id}</td>
                                <td>{row.description}</td>
                                <td>{formateNumber(row.value)}</td>
                                <td>{row.fixed ? "FIXO" : "NÃO FIXO"}</td>
                                <td>{row.dateOfSpent}</td>
                                {location === "/gastos" && (
                                    <td>
                                        <MdDelete
                                            style={{ color: "red" }}
                                            onClick={(e) => openModal(e, row.id, row.description)}
                                        />
                                        <FaPen onClick={(e) => selected(e, row.id)} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reportData && (
                    <div style={{ textAlign: "center", margin: "50px 0" }}>
                        <p style={{ fontSize: "20px" }}>
                            Faturamento total: {" "}
                            <span style={{ color: "#28a745" }}>
                                {formateNumber(reportData.reduce((accumulator, currentItem) => {
                                    return (accumulator + currentItem.price);
                                }, 0))}
                            </span>
                        </p>
                    </div>
                )}

                {reportDataSpent && (
                    <div style={{ textAlign: "center", margin: "50px 0" }}>
                        <p style={{ fontSize: "20px" }}>
                            Gasto total: {" "}
                            <span style={{ color: "red" }}>
                                {formateNumber(reportDataSpent.reduce((accumulator, currentItem) => {
                                    return (accumulator + currentItem.value);
                                }, 0))}
                            </span>
                        </p>
                    </div>

                )}

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

export default ReportPDF;



