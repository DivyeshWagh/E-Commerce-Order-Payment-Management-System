import api from './api';

export const paymentService = {
  // Backend: POST /api/payments/initiate?orderId={orderId}&method={method}
  initiatePayment: async (orderId, method) => {
    const response = await api.post('/api/payments/initiate', null, {
      params: { orderId, method }
    });
    return response.data;
  },

  // Backend: PUT /api/payments/{paymentId}/status?status={status}
  updatePaymentStatus: async (paymentId, status = 'SUCCESS') => {
    const response = await api.put(`/api/payments/${paymentId}/status`, null, {
      params: { status }
    });
    return response.data;
  },
};
