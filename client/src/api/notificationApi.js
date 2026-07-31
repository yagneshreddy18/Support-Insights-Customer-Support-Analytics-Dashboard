import axiosInstance from './axiosInstance';

export const notificationApi = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all')
};
