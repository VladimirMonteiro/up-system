export const formatCnpj = (e) => {
    let value = e.target.value;
  
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, "");
  
    // Aplica a formatação gradual para o CNPJ
    if (value.length <= 14) {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"); // Formato completo
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})$/, "$1.$2.$3/$4"); // Aplica a barra
      value = value.replace(/(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3"); // Aplica o primeiro ponto
      value = value.replace(/(\d{2})(\d{3})$/, "$1.$2"); // Aplica o segundo ponto
    }

  return value
 
  };
  
  export const removeCNPJFormatting = (cnpj) => {
    return cnpj
    
    
  };
  