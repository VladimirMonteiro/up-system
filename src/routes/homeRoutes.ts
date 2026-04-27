import api from '../utils/api';

export const homeRoutes = {
  getDashboardData: () => api.get('/dashboard'),
};
