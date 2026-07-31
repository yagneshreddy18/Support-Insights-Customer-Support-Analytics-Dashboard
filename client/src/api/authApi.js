import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: (refreshToken) => axiosInstance.post('/auth/logout', { refreshToken }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data)
};
