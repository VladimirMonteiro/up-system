export const formatCPF = (e, setCPF) => {
    let value = e.target.value;
  
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, "");
  
    // Aplica a formatação gradualmente
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3"); // Aplica o primeiro ponto
      value = value.replace(/(\d{3})(\d{3})$/, "$1.$2"); // Aplica o segundo ponto, se necessário
    }
  
    // Atualiza o estado com o valor formatado
    setCPF(value);
  };
  
  
