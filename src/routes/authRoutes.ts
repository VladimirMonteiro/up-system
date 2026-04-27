import { LoginRequest } from '../services/authService/types';
import api from '../utils/api';

export const authRoutes = {
  login: (data: LoginRequest) => api.post('auth/login', data),
};
