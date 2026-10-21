import api from '../axios';

// ===== CREATE =====
export const createBlog = async (formData) => {
  try {
    const response = await api.post('/api/blogs/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== GET ALL =====
export const getAllBlogs = async ({
  page = 1,
  limit = 10,
  status = '',
  category = '',
  search = '',
  sortBy = 'createdAt',
  order = 'desc',
} = {}) => {
  let url = `/api/blogs/get-all?page=${page}&limit=${limit}`;

  if (status && status.trim()) {
    url += `&status=${encodeURIComponent(status)}`;
  }

  if (category && category.trim()) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (search && search.trim()) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (sortBy && sortBy.trim()) {
    url += `&sortBy=${encodeURIComponent(sortBy)}`;
  }

  if (order && order.trim()) {
    url += `&order=${encodeURIComponent(order)}`;
  }

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== GET SINGLE =====
export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/api/blogs/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Blog not found');
  }
};

// ===== UPDATE =====
export const updateBlog = async (id, formData) => {
  try {
    const response = await api.put(`/api/blogs/update/${id}`, formData, {
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
export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/api/blogs/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};