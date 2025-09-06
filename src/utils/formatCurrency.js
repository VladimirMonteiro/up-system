import currency from 'currency.js';
const BRL_CONFIG = {
  symbol: 'R$ ',
  decimal: ',',
  separator: '.',
  precision: 2
};
export const formatCurrency = (value) => {
  return currency(value, BRL_CONFIG).format();
};

/**
 * Formata valor bruto digitado no input para formato de moeda BRL.
 * Exemplo: "1234" -> "R$ 12,34"
 */
export const formatInputToCurrency = (rawValue) => {
  // Remove tudo que não for número
  const numericOnly = rawValue.replace(/\D/g, "");

  // Usa currency.js com 'fromCents: true' para lidar com centavos
  return currency(numericOnly, {
    ...BRL_CONFIG,
    fromCents: true
  }).format();
};

/**
 * Converte string formatada para número (float)
 * Exemplo: "R$ 1.234,56" → 1234.56
 */
export const parseCurrencyToFloat = (formattedValue) => {
  return currency(formattedValue, BRL_CONFIG).value;
};



