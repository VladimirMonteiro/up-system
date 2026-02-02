import api from '../../../utils/api';

export const toolService = {
  findAll: (params) => api.get('/tools', { params }),
  searchTool: (params) => api.get('/tools/search', { params }),
  findById: (id) => api.get(`/tools/${id}`),
  create: (data) => api.post('/tools/create', data),
  update: (id, data) => api.put(`/tools/update/${id}`, data),
  remove: (id) => api.delete(`/tools/delete/${id}`),
};
