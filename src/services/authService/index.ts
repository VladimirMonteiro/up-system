import { authRoutes } from '../../routes/authRoutes';
import { LoginRequest, LoginResponse } from './types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await authRoutes.login(data);

    console.log('Resposta do servidor:', response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};
