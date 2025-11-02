import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Interceptor para debug
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (params) => api.get('/transactions/summary', { params }),
  getCategories: () => api.get('/transactions/categories'),
  createCategory: (data) => api.post('/transactions/categories', data),
  deleteCategory: (id) => api.delete(`/transactions/categories/${id}`)
};

export const insightsAPI = {
  getInsights: () => api.get('/insights')
};

export const investmentAPI = {
  getAll: () => api.get('/investments'),
  create: (data) => api.post('/investments', data),
  update: (id, data) => api.put(`/investments/${id}`, data),
  delete: (id) => api.delete(`/investments/${id}`),
  addContribution: (data) => api.post('/investments/contributions', data),
  getContributions: (investmentId) => api.get(`/investments/${investmentId}/contributions`)
};

export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  getProjections: () => api.get('/goals/projections')
};

export const simulationAPI = {
  getAll: () => api.get('/simulations'),
  create: (data) => api.post('/simulations', data),
  delete: (id) => api.delete(`/simulations/${id}`)
};

export const budgetAPI = {
  getAll: (params) => api.get('/budgets', { params }),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  initDefaults: () => api.post('/budgets/init-defaults')
};

export const debtAPI = {
  getAll: () => api.get('/debts'),
  create: (data) => api.post('/debts', data),
  update: (id, data) => api.put(`/debts/${id}`, data),
  delete: (id) => api.delete(`/debts/${id}`),
  makePayment: (id, amount) => api.put(`/debts/${id}/payment`, { amount })
};

export const alertAPI = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  generate: () => api.post('/alerts/generate')
};

export const emergencyFundAPI = {
  get: () => api.get('/emergency-fund'),
  update: (data) => api.put('/emergency-fund', data),
  addContribution: (amount) => api.post('/emergency-fund/contribute', { amount })
};

export { api };
export default api;