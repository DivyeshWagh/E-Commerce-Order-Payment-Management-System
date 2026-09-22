import api from './api';

export const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`/api/cart/getCart/${userId}`);
    return response.data;
  },

  addToCart: async (userId, productId, quantity) => {
    const response = await api.post(`/api/cart/${userId}/add/${productId}/${quantity}`);
    return response.data;
  },

  updateItemQuantity: async (userId, itemId, quantity) => {
    const response = await api.put(`/api/cart/${userId}/items/${itemId}`, null, {
      params: { quantity }
    });
    return response.data;
  },

  removeItem: async (userId, productId) => {
    const response = await api.delete(`/api/cart/removeItem/${userId}/${productId}`);
    return response.data;
  },
};
