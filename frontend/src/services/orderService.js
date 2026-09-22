import api from './api';

export const orderService = {
  checkout: async (userId, shippingAddress) => {
    const response = await api.post(`/api/orders/checkout/${userId}`, shippingAddress);
    return response.data;
  },

  getUserOrders: async (userId) => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId, userId) => {
    const response = await api.get(`/api/orders/${orderId}/user/${userId}`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/orders/admin/${orderId}/status`, null, {
      params: { status }
    });
    return response.data;
  },
};
