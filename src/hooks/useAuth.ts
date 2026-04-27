import { useContext } from 'react';
import { authContext } from '../context/authProvider/AuthContext';

export function useAuth() {
  const context = useContext(authContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
