import api from '../../../utils/api';

export const homeService = {
  getDashboardData: () => api.get('/dashboard'),
};
