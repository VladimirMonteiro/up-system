import axios from 'axios';
import { getUserLocalStorage } from '../context/authProvider/utils';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${baseURL}`
});

api.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();  // Recupera o usuário do localStorage
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;  // Adiciona o token ao cabeçalho
    }
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;
