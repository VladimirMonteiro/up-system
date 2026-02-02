import api from '../../../utils/api';

export const singleToolService = {
  findById: (id) => api.get(`/tools/${id}`),
};
