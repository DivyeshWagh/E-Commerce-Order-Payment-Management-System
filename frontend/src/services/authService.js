import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data; // { token, userId, email, roles }
  },

  register: async (userData, roleType = 'CUSTOMER') => {
    const response = await api.post(`/api/auth/register/${roleType}`, userData);
    return response.data;
  },
};
