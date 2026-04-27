import api from '../../utils/api';
import { User } from '../types';

export function setUserLocalStorage(user: User) {
  localStorage.setItem('u', JSON.stringify(user));
}

export function getUserLocalStorage(): User | null {
  const json = localStorage.getItem('u');

  if (!json) {
    return null;
  }

  const user: User = JSON.parse(json);

  if (user && user.token) {
    api.defaults.headers.common['Authorization'] = user.token;
  }

  return user;
}
