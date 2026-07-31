import axiosInstance from './axiosInstance';

export const userApi = {
  getUsers: (params) => axiosInstance.get('/users', { params }),
  createUser: (data) => axiosInstance.post('/users', data),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`)
};
