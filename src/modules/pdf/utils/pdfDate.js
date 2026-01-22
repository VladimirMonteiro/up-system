export const formatDate = (date) => {
  if (!date) return '';

  if (typeof date === 'string' && date.includes('/')) {
    const [d, m, y] = date.split('/');
    date = `${y}-${m}-${d}`;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const getMonthName = (month) =>
  [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ][month - 1];
