export const PAYMENT_LABEL = {
  PAID: 'PAGO',
  PARTIALLY_PAID: 'PARCIAL',
  UNPAID: 'NÃO PAGO',
};

export const RENT_STATE_LABEL = {
  DELIVERED: 'ENTREGUE',
  PENDENT: 'PENDENTE',
};

export const paymentClass = (status, styles) => {
  if (status === 'PAID') return styles.rowPaid;
  if (status === 'PARTIALLY_PAID') return styles.rowNear;
  return styles.rowOverdue;
};

export const rentStateClass = (state, styles) =>
  state === 'DELIVERED' ? styles.rowPaid : styles.rowOverdue;
