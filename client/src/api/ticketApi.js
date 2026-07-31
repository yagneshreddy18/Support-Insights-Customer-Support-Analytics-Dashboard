import axiosInstance from './axiosInstance';

export const ticketApi = {
  getTickets: (params) => axiosInstance.get('/tickets', { params }),
  getTicketById: (id) => axiosInstance.get(`/tickets/${id}`),
  createTicket: (data) => axiosInstance.post('/tickets', data),
  updateTicket: (id, data) => axiosInstance.put(`/tickets/${id}`, data),
  deleteTicket: (id) => axiosInstance.delete(`/tickets/${id}`),
  assignTicket: (id, agentId) => axiosInstance.put(`/tickets/${id}/assign`, { assigned_agent_id: agentId }),
  updateStatus: (id, status, notes) => axiosInstance.put(`/tickets/${id}/status`, { status, resolution_notes: notes }),
  getComments: (id) => axiosInstance.get(`/tickets/${id}/comments`),
  addComment: (id, message, isInternal) => axiosInstance.post(`/tickets/${id}/comments`, { message, is_internal: isInternal }),
  uploadAttachment: (id, formData) => axiosInstance.post(`/tickets/${id}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
