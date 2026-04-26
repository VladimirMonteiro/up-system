export const formateNumber = (number: number) => {
  const formatNumber = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  return formatNumber.format(number);
};
