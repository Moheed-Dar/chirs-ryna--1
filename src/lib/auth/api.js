import api from '../axios';

// ===== LOGIN =====
export const loginAdmin = async (email, password) => {
  const response = await api.post('/api/auth/admin/login', { email, password });
  return response.data;
};

// ===== LOGOUT =====
export const logoutAdmin = async () => {
  const response = await api.post('/api/auth/admin/logout');
  return response.data;
};