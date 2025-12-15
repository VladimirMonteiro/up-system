// src/components/pdf/BudgetPdf.jsx
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import styles from './BudgetPdf.module.css';

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
    qualityRatio: 0.95,
  },
  overrides: {
    pdf: { compress: true },
    canvas: { useCORS: true },
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value ?? 0));

export default function BudgetPdf() {
  const { state: budget } = useLocation();
  const targetRef = useRef();

  if (!budget)
    return (
      <div className={styles.errorContainer}>
        <h2>Nenhum orçamento encontrado!</h2>
        <p>Volte e gere novamente.</p>
      </div>
    );

  const { id, price, discount, freight, obs, initialDate, deliveryDate, budgetItems, client } =
    budget;

  const items = Array.isArray(budgetItems) ? budgetItems : [];
  const addresses = Array.isArray(client?.addresses)
    ? client.addresses
    : [...(client?.addresses ?? [])]; // converte Set -> Array

  const finalPrice = Number(price) - Number(discount) + Number(freight);

  const toPDF = () => {
    const filename = `Orcamento_UpLocacoes_${id}.pdf`;
    generatePDF(targetRef, options)(filename);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pdfButtonContainer}>
        <button className={styles.pdfButton} onClick={toPDF}>
          ⬇️ Baixar PDF
        </button>
      </div>

      <div ref={targetRef} className={styles.budgetContainer}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Up Locações</h1>
          <p className={styles.subtitle}>LOCAÇÃO DE EQUIPAMENTOS PARA CONSTRUÇÃO CIVIL</p>
        </header>

        {/* 1. DETALHES DO ORÇAMENTO */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. DETALHES DO ORÇAMENTO</h2>
          <div className={styles.dataGrid}>
            <p>
              <strong>ID Orçamento:</strong>
            </p>{' '}
            <p>{id}</p>
            <p>
              <strong>Data Inicial:</strong>
            </p>{' '}
            <p>{initialDate}</p>
            <p>
              <strong>Data Devolução:</strong>
            </p>{' '}
            <p>{deliveryDate}</p>
            <p>
              <strong>Subtotal Itens:</strong>
            </p>
            <p>{formatCurrency(price)}</p>
            <p>
              <strong>Desconto:</strong>
            </p>
            <p>- {formatCurrency(discount)}</p>
            <p>
              <strong>Frete:</strong>
            </p>
            <p>{formatCurrency(freight)}</p>
            <p>
              <strong>Valor Final:</strong>
            </p>
            <p className={styles.finalPrice}>{formatCurrency(finalPrice)}</p>
            <p className={styles.obsLabel}>
              <strong>Observações:</strong>
            </p>
            <p className={styles.obsText}>{obs || 'Nenhuma'}</p>
          </div>
        </section>

        {/* 2. INFORMAÇÕES DO CLIENTE */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. INFORMAÇÕES DO CLIENTE</h2>
          <div className={styles.dataGrid}>
            <p>
              <strong>ID Cliente:</strong>
            </p>{' '}
            <p>{client?.id}</p>
            <p>
              <strong>Nome/Razão Social:</strong>
            </p>
            <p>{client?.name}</p>
            <p>
              <strong>CPF/CNPJ:</strong>
            </p>
            <p>{client?.document}</p>
            <p>
              <strong>Telefone:</strong>
            </p>
            <p>{client?.phone}</p>
            <p className={styles.obsLabel}>
              <strong>Endereços:</strong>
            </p>
            <div className={styles.addressList}>
              {addresses.length === 0 && <p>Nenhum endereço informado.</p>}

              {addresses.map((addr, index) => (
                <p key={index}>
                  {addr.street}, {addr.number} — {addr.district}
                  <br />
                  {addr.city}/{addr.state} — CEP {addr.cep}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ITENS DO ORÇAMENTO */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. ITENS DO ORÇAMENTO</h2>
          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Equipamento</th>
                <th>Qtd.</th>
                <th>Valor Unitário</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.toolName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan='4' className={styles.tableFooterLabel}>
                  Total de Itens
                </td>
                <td className={styles.tableFooterValue}>{formatCurrency(price)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* 4. RESUMO */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. RESUMO</h2>
          <div className={styles.summaryBox}>
            <div className={styles.summaryDetail}>
              <p>Total Equipamentos</p>
              <p>{formatCurrency(price)}</p>
            </div>

            <div className={styles.summaryDetail}>
              <p>Desconto</p>
              <p>- {formatCurrency(discount)}</p>
            </div>

            <div className={styles.summaryDetail}>
              <p>Frete</p>
              <p>{formatCurrency(freight)}</p>
            </div>

            <div className={styles.summaryTotal}>
              <p>TOTAL A PAGAR</p>
              <p className={styles.summaryFinalValue}>{formatCurrency(finalPrice)}</p>
            </div>
          </div>
        </section>

        {/* 5. TERMOS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. TERMOS E CONDIÇÕES</h2>
          <ul className={styles.termsList}>
            <li>Validade do orçamento: 5 dias úteis.</li>
            <li>Equipamentos devem ser devolvidos limpos.</li>
            <li>Danos serão cobrados conforme tabela de reposição.</li>
            <li>Frete cobre apenas entrega e retirada.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
