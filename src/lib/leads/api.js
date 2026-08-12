import api from '../axios';

// ===== CREATE =====
export const submitLead = async (formData) => {
  const response = await api.post('/api/leads/create', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// ===== GET ALL =====
export const getAllLeads = async (params = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    sortBy = "",
    sortOrder = "",
    status = "",
    source = "",
    leadType = "",
    guideType = "" // ✅ FIX: guideType add kiya
  } = params;

  // URL build karna
  let url = `/api/leads/get-all?page=${page}&limit=${limit}`;

  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortOrder) url += `&sortOrder=${sortOrder}`;
  if (status) url += `&status=${status}`;
  if (source) url += `&source=${source}`;
  if (leadType) url += `&leadType=${leadType}`;
  
  // ✅ FIX: Agar guideType hai toh URL mein add karo
  if (guideType) url += `&guideType=${guideType}`;

  const response = await api.get(url);
  return response.data;
};

// ===== GET SINGLE =====
export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/api/leads/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lead not found');
  }
};

// ===== DELETE =====
export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/api/leads/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== MARK AS READ =====
export const markLeadAsRead = async (id) => {
  try {
    const response = await api.patch(`/api/leads/updatebyid/mark-read/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark lead as read');
  }
};