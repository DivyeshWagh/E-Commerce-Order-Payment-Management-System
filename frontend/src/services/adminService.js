import api from './api';

export const adminService = {
  // Backend: GET /api/admin/dashboard
  getDashboardMetrics: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  // Backend: GET /api/admin/inventory/low-stock?threshold=
  getLowStockInventory: async (threshold = 5) => {
    const response = await api.get('/api/admin/inventory/low-stock', {
      params: { threshold }
    });
    return response.data;
  },

  // Backend: PUT /api/admin/inventory/{productId}?availableQuantity=
  updateInventoryStock: async (productId, availableQuantity) => {
    const response = await api.put(`/api/admin/inventory/${productId}`, null, {
      params: { availableQuantity }
    });
    return response.data;
  },

  // Backend: GET /api/users/getallusers
  getAllUsers: async () => {
    const response = await api.get('/api/users/getallusers');
    return response.data;
  },
};

