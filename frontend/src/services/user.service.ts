import api from './api';

export const userService = {
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  }
};
