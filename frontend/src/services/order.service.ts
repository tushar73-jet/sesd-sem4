import api from './api';

export const orderService = {
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getMySales: async () => {
    const response = await api.get('/orders/my-sales');
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};
