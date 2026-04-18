import api from './api';

export const productService = {
  getProducts: async (params: { page?: number; limit?: number; search?: string; category?: string; status?: string }) => {
    // Convert undefined params to empty strings or omit to clean up the URL
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== ''));
    const response = await api.get('/products', { params: cleanParams });
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
