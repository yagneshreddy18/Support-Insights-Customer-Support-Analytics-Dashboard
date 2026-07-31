import axiosInstance from './axiosInstance';

export const categoryApi = {
  getCategories: () => axiosInstance.get('/categories'),
  createCategory: (data) => axiosInstance.post('/categories', data),
  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`)
};
