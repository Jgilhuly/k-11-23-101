import apiClient from './api';

const productService = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (product) => {
    try {
      const response = await apiClient.post('/products', product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await apiClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;

