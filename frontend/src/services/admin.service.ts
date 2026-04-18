import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  toggleSuspension: async (id: string, isSuspended: boolean) => {
    const response = await api.put(`/admin/users/${id}/suspend`, { isSuspended });
    return response.data;
  }
};
