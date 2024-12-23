 export const handlePriceChange = (e, setPrice) => {
    let value = e.target.value;

    // Remove qualquer caractere não numérico (exceto vírgulas)
    value = value.replace(/\D/g, '');

    // Adiciona a vírgula para separar os centavos
    if (value.length > 2) {
      const decimalPart = value.slice(-2); // Últimos 2 dígitos são os centavos
      const integerPart = value.slice(0, -2); // O restante são os milhares

      // Formata o número inteiro com pontos para separar os milhares
      const formattedInteger = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      
      // Combina a parte inteira com a parte decimal
      value = formattedInteger + ',' + decimalPart;
    } else {
      // Se o valor for menor ou igual a 2 caracteres, não formata
      // eslint-disable-next-line no-self-assign
      value = value;
    }

    setPrice(value);
  };