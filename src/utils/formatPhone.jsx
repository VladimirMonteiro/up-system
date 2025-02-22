export const formatPhone = (e, setPhone) => {
    let phoneValue = e.target.value;

    // Remove qualquer caractere não numérico
    phoneValue = phoneValue.replace(/\D/g, "");

    
    setPhone(phoneValue.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1'))
};
