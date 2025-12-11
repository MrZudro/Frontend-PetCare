import api from './axiosConfig';

const vaccinesService = {
  getAll: () => api.get('/vaccines'),
  getById: (id) => api.get(`/vaccines/${id}`),
  create: (data) => api.post('/vaccines', data),
  update: (id, data) => api.put(`/vaccines/${id}`, data),
  delete: (id) => api.delete(`/vaccines/${id}`)
};

export default vaccinesService;