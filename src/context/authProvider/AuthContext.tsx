import { createContext, useState, useEffect, ReactNode } from 'react';
import { getUserLocalStorage, setUserLocalStorage } from './utils';
import { login } from '../../services/authService';
import { LoginRequest } from '../../services/authService/types';
import { AuthContextType, AuthProviderProps, User } from '../types';

const authContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserLocalStorage();

    if (userData) {
      setUser(userData);
    }

    setLoading(false);
  }, []);

  async function authenticate(data: LoginRequest) {
    const response = await login(data);

    if (response) {
      const payload: User = {
        token: response.token,
      };

      setUser(payload);
      setUserLocalStorage(payload);
    }

    return response;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('u');
  }

  return (
    <authContext.Provider
      value={{
        user,
        loading,
        authenticate,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthProvider };
