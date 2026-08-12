import api from '../axios';

// ===== CREATE =====
export const createProperty = async (formData) => {
  const response = await api.post('/api/properties/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ===== GET ALL =====
export const getAllProperties = async (
  page = 1,
  limit = 10,
  type,
  isSearch = false,
  searchQuery = ""
) => {
  let url = `/api/properties/get-all?page=${page}&limit=${limit}`;

  if (type && type.trim()) {
    url += `&type=${encodeURIComponent(type)}`;
  }

  if (isSearch && searchQuery) {
    url += `&isSearch=true&query=${encodeURIComponent(searchQuery)}`;
  }

  const response = await api.get(url);
  return response.data;
};

// ===== GET SINGLE =====
export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/api/properties/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Property not found');
  }
};

// ===== UPDATE =====
export const updateProperty = async (id, formData) => {
  try {
    const response = await api.put(`/api/properties/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== DELETE =====
export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/api/properties/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};