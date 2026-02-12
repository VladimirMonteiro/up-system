// src/components/QuotationSummary.js
import styles from "./QuotationSummary.module.css";
import api from "../../../utils/api";

import { useNavigate } from "react-router-dom";
import { message } from "antd";

const QuotationSummary = ({ totals, client, tools, discount, freight }) => {
  // Evita erro caso totals venha undefined
  const safeTotals = {
    subtotal: Number(totals?.subtotal ?? 0),
    totalDiscount: Number(discount ?? 0),
    freight: Number(freight ?? 0),
    total: Number(totals?.total ?? 0),
  };

  const navigate = useNavigate();

  // --------- ENVIO PARA O BACKEND ----------
  const handleSendBudget = async () => {
  try {
    message.loading("Enviando orçamento...")
    const payload = {
      clientId: client.id,
      price: safeTotals.total,
      discount: Number(discount) || 0,
      initialDate: document.getElementById("initialDate").value,
      deliveryDate: document.getElementById("deliveryDate").value,
      freight: Number(freight) || 0,
      obs: document.getElementById("obs").value,
      budgetItems: tools.map((t) => ({
        toolId: t.id,
        quantity: Number(t.quantity),
        price: Number(t.price),
      })),
    };

    const response = await api.post("/budgets", payload, {
      responseType: "blob", // 👈 MUITO IMPORTANTE
    });

  

    // Criar URL temporária do PDF
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Abrir em nova aba
    window.open(fileURL);

    // Ou se quiser forçar download:
    /*
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "orcamento.pdf";
    link.click();
    */

    navigate("/orcamentos");

  } catch (error) {
    console.error("Erro ao enviar orçamento:", error);
    message.error("Erro ao enviar orçamento. Tente novamente.");
  }
};


  return (
    <aside className={styles.summaryPanel}>
      <h3 className={styles.summaryTitle}>RESUMO DE ORÇAMENTO</h3>

      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Subtotal dos Itens:</span>
        <span className={styles.summaryValue}>
          R$ {safeTotals.subtotal.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Desconto Total:</span>
        <span className={styles.summaryValue}>
          R$ {safeTotals.totalDiscount.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Valor do Frete:</span>
        <span className={styles.summaryValue}>
          R$ {safeTotals.freight.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className={styles.totalGeneral}>
        <span className={styles.totalLabel}>TOTAL DO ORÇAMENTO:</span>
        <span className={styles.totalValue}>
          R$ {safeTotals.total.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className={styles.conditions}>
        <h4 className={styles.conditionsTitle}>Condições de Pagamento:</h4>
        <p className={styles.conditionsText}>30 dias líquidos, contra boleto bancário.</p>
      </div>

      <button onClick={handleSendBudget} className={styles.actionButton}>
        GERAR PDF E ENVIAR
      </button>
    </aside>
  );
};

export default QuotationSummary;
