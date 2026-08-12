import api from '../axios';

// ===== DOWNLOAD GUIDE =====
export const downloadGuide = async (formData) => {
  const response = await api.post('/api/guides/download', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};