export const formatPhone = (value) => {
  if (!value) return '';

  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '');

  // Celular com 11 dígitos (DDD + 9 dígitos)
  if (numericValue.length === 11) {
    return numericValue
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  // Telefone fixo com 10 dígitos
  if (numericValue.length === 10) {
    return numericValue
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d{4})$/, '$1-$2');
  }

  // Se ainda estiver digitando (menos de 10 dígitos)
  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  }

  if (numericValue.length <= 6) {
    return numericValue.replace(/^(\d{2})(\d+)/, '($1) $2');
  }

  return numericValue.replace(/^(\d{2})(\d+)/, '($1) $2');
};
