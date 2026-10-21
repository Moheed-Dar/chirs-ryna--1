// import axios from 'axios';

// const api = axios.create({
//   withCredentials: true,
// });

// // ===== CREATE =====
// // POST /api/properties/create
// export const createProperty = async (formData) => {
//   const response = await api.post('/api/properties/create', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// // ===== GET ALL =====
// // GET /api/properties/get-all
// export const getAllProperties = async (
//   page = 1,
//   limit = 10,
//   type,
//   isSearch = false,
//   searchQuery = ""
// ) => {
//   let url = `/api/properties/get-all?page=${page}&limit=${limit}`;

//   if (type && type.trim()) {
//     url += `&type=${encodeURIComponent(type)}`;
//   }

//   if (isSearch && searchQuery) {
//     url += `&isSearch=true&query=${encodeURIComponent(searchQuery)}`;
//   }

//   const response = await api.get(url);
//   return response.data;
// };

// // ===== GET SINGLE =====
// // GET /api/properties/get/[id]
// export const getPropertyById = async (id) => {
//   try {
//     const response = await api.get(`/api/properties/get/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Property not found');
//   }
// };

// // ===== UPDATE =====
// // PUT /api/properties/update/[id]
// export const updateProperty = async (id, formData) => {
//   try {
//     const response = await api.put(`/api/properties/update/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // ===== DELETE =====
// // DELETE /api/properties/delete/[id]
// export const deleteProperty = async (id) => {
//   try {
//     const response = await api.delete(`/api/properties/delete/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };







// // ===== CONTACT =====
// // POST /api/contact
// export const submitContact = async (formData) => {
//   const response = await api.post('/api/contact/create', formData, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return response.data;
// };
// // ===== leads =====
// // POST /api/leads/create
// export const submitLead = async (formData) => {
//   const response = await api.post('/api/leads/create', formData, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return response.data;
// };





// // ===== GUIDE DOWNLOAD =====
// // POST /api/guides/download
// export const downloadGuide = async (formData) => {
//   const response = await api.post('/api/guides/download', formData, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return response.data;
// };






import axios from 'axios';

const api = axios.create({
  withCredentials: true,
});

// ===== AUTH — LOGIN =====
export const loginAdmin = async (email, password) => {
  const response = await api.post('/api/auth/admin/login', { email, password });
  return response.data;
};

// ===== AUTH — LOGOUT =====
export const logoutAdmin = async () => {
  const response = await api.post('/api/auth/admin/logout');
  return response.data;
};

// ===== CREATE =====
// POST /api/properties/create
export const createProperty = async (formData) => {
  const response = await api.post('/api/properties/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ===== GET ALL =====
// GET /api/properties/get-all
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
// GET /api/properties/get/[id]
export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/api/properties/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Property not found');
  }
};

// ===== UPDATE =====
// PUT /api/properties/update/[id]
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
// DELETE /api/properties/delete/[id]
export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/api/properties/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== CONTACT =====
// POST /api/contact
export const submitContact = async (formData) => {
  const response = await api.post('/api/contact/create', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// ===== LEADS =====
// POST /api/leads/create
export const submitLead = async (formData) => {
  const response = await api.post('/api/leads/create', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// GET ALL LEADS
// GET /api/leads/get-all
export const getAllLeads = async (
  page = 1,
  limit = 10,
  propertyId = "",
  isSearch = false,
  searchQuery = ""
) => {
  let url = `/api/leads/get-all?page=${page}&limit=${limit}`;

  if (propertyId && propertyId.trim()) {
    url += `&propertyId=${encodeURIComponent(propertyId)}`;
  }

  if (isSearch && searchQuery) {
    url += `&isSearch=true&query=${encodeURIComponent(searchQuery)}`;
  }

  const response = await api.get(url);
  return response.data;
};

// GET SINGLE LEAD
// GET /api/leads/get/[id]
export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/api/leads/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lead not found');
  }
};

// DELETE LEAD
// DELETE /api/leads/delete/[id]
export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/api/leads/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// ✅ MARK LEAD AS READ
export const markLeadAsRead = async (id) => {
  try {
    const response = await api.patch(`/api/leads/updatebyid/mark-read/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark lead as read');
  }
};

// ===== GUIDE DOWNLOAD =====
// POST /api/guides/download
export const downloadGuide = async (formData) => {
  const response = await api.post('/api/guides/download', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};