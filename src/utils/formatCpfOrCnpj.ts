export const formatCpfCnpj = (value: string) => {
  if (!value) return '';

  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '');

  // CPF
  if (numericValue.length === 11) {
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // CNPJ
  if (numericValue.length === 14) {
    return numericValue
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

  // Se não for nenhum dos dois, retorna original limpo
  return numericValue;
};
