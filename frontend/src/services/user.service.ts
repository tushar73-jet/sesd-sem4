import api from './api';

export const userService = {
  updateProfile: async (data: { name?: string; password?: string }) => {
    // Note: Assuming a future PUT /auth/profile endpoint if we want direct user updates, 
    // or we can mock the success here for Step 6's scope until backend handles Profile PUT.
    // For now we will mock it since we haven't built a PUT /users route in Phase 3.
    // In a real scenario: const response = await api.put('/users/profile', data);
    return new Promise((resolve) => setTimeout(() => resolve({ data: { message: 'Profile updated temporarily in local scope' } }), 1000));
  }
};
