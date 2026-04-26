import { ChangeEvent } from 'react';

export const formatCPF = (
  e: ChangeEvent<HTMLInputElement>,
  setCPF: React.Dispatch<React.SetStateAction<string>>,
) => {
  let value = e.target.value;

  value = value.replace(/\D/g, '');

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    value = value.replace(/(\d{3})(\d{3})$/, '$1.$2');
  }

  setCPF(value);
};
