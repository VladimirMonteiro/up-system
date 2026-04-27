import { ReactNode } from 'react';
import { LoginRequest } from '../services/authService/types';

export type User = {
  token: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  authenticate: (data: LoginRequest) => Promise<any>;
  logout: () => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};
