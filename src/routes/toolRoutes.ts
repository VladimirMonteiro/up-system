import {
  CreateToolRequest,
  ParamsProps,
  SearchParamsProps,
  UpdateToolRequest,
} from '../services/toolService/types';
import api from '../utils/api';

export const toolRoutes = {
  findAll: (params: ParamsProps) => api.get('/tools', { params }),
  searchTool: (params: SearchParamsProps) => api.get('/tools/search', { params }),
  findById: (id: number) => api.get(`/tools/${id}`),
  create: (data: CreateToolRequest) => api.post('/tools', data),
  update: (id: number, data: UpdateToolRequest) => api.put(`/tools/${id}`, data),
  remove: (id: number) => api.delete(`/tools/${id}`),
};
