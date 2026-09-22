import api from './api';

export const addressService = {
  getUserAddresses: async (userId) => {
    const response = await api.get(`/api/addresses/user/${userId}`);
    return response.data;
  },

  getAddressById: async (id) => {
    const response = await api.get(`/api/addresses/${id}`);
    return response.data;
  },

  addAddress: async (userId, addressData) => {
    const response = await api.post(`/api/addresses/${userId}`, addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await api.put(`/api/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/api/addresses/${id}`);
    return response.data;
  },
};
