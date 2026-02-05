import api from '../../../utils/api';

export const rentService = {
  findAll: (page, size) => api.get(`/rent?page=${page}&size=${size}`),

  filter: (params) => api.get('/rent/filter', { params }),

  delete: (id) => api.delete(`/rent/delete/${id}`),

  complete: (id) => api.put(`/rent/completed/${id}`),

  getContract: (rentId) =>
    api.get(`/rent/${rentId}/contract`, {
      responseType: 'blob',
    }),
};
