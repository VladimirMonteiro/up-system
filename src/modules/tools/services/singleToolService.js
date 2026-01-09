import api from '../../../utils/api';

export const singleToolService = {
  findByRentId: (id) => api.get(`rent/tool/${id}`),
  findById: (id) => api.get(`/tools/${id}`),
};
