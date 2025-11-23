import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Quiz API
export const quizAPI = {
  create: (data) => api.post('/quizzes', data),
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  getPublic: (id) => api.get(`/quizzes/public/${id}`),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  togglePublish: (id) => api.patch(`/quizzes/${id}/publish`),
  getStats: (id) => api.get(`/quizzes/${id}/stats`)
};

// AI API
export const aiAPI = {
  generateQuestions: (data) => api.post('/ai/generate-questions', data)
};

// Attempt API
export const attemptAPI = {
  start: (data) => api.post('/attempts/start', data),
  submit: (attemptId, data) => api.post(`/attempts/${attemptId}/submit`, data),
  getById: (id) => api.get(`/attempts/${id}`),
  getQuizAttempts: (quizId) => api.get(`/attempts/quiz/${quizId}`),
  getAttemptDetails: (attemptId) => api.get(`/attempts/${attemptId}/details`),
  getAllMyAttempts: () => api.get('/attempts/my-quizzes/all')
};

export default api;
