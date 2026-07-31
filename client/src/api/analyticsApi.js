import axiosInstance from './axiosInstance';

export const analyticsApi = {
  getOverview: () => axiosInstance.get('/analytics/overview'),
  getStatusDistribution: () => axiosInstance.get('/analytics/status'),
  getCategoryDistribution: () => axiosInstance.get('/analytics/category'),
  getMonthlyTrends: () => axiosInstance.get('/analytics/monthly'),
  getEmployeePerformance: () => axiosInstance.get('/analytics/employees'),
  exportReport: () => axiosInstance.get('/analytics/export', { responseType: 'blob' })
};
