import api from '../../../utils/api';

export const paymentsService = {
  findByRent(rentId) {
    return api.get(`/payments/rent/${rentId}`);
  },

  create(rentId, data) {
    return api.post(`/payments/rent/${rentId}`, data);
  },
};
