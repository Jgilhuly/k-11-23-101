import apiClient from './api';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (user) => {
    try {
      const response = await apiClient.post('/users', user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, user) => {
    try {
      const response = await apiClient.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;

