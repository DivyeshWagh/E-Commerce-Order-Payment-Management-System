import api from './api';

export const productService = {
  // Backend: GET /api/products/getAllprod
  getAllProducts: async () => {
    const response = await api.get('/api/products/getAllprod');
    return response.data;
  },

  // Backend: GET /api/products/{id}
  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Backend: GET /api/products?search={name}
  searchProducts: async (name) => {
    const response = await api.get('/api/products', { params: { search: name } });
    return response.data;
  },

  // Backend: GET /api/products?category={categoryName}
  getProductsByCategory: async (categoryName) => {
    const response = await api.get('/api/products', { params: { category: categoryName } });
    return response.data;
  },

  // Backend: GET /api/products?minPrice={minPrice}&maxPrice={maxPrice}
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    const response = await api.get('/api/products', { params: { minPrice, maxPrice } });
    return response.data;
  },

  // Backend: GET /api/products/paged?page=&size=&sortBy=&direction=
  getPagedProducts: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
    const response = await api.get('/api/products/paged', { params: { page, size, sortBy, direction } });
    return response.data;
  },

  // Backend: POST /api/products/addproduct — body is Product entity
  createProduct: async (productData) => {
    const response = await api.post('/api/products/addproduct', productData);
    return response.data;
  },

  // Backend: PUT /api/products/{id} — body is Product entity
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Backend: DELETE /api/products/deleteProduct/{productId}
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/deleteProduct/${id}`);
    return response.data;
  },
};
