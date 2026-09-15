// ==========================================
// ✅ ADMIN — GET ALL SUBSCRIBERS
// (Response flattened — baaki APIs jaisa consistent)
// ==========================================
export const getSubscribers = async ({
  page = 1,
  limit = 20,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
      ...(search && { search }),
    });

    const res = await fetch(`/api/subscribers/get-all?${params}`, {
      method: 'GET',
      credentials: 'include',
    });

    const json = await res.json();

    // ✅ FLATTEN: totalCount ko top-level pe le aao
    // taake dashboard mein baaki stats jaisa hi kaam kare
    return {
      ...json,
      totalCount:
        json?.data?.pagination?.totalCount ??
        json?.totalCount ??
        json?.total ??
        0,
      subscribers: json?.data?.subscribers ?? json?.subscribers ?? [],
      pagination: json?.data?.pagination ?? json?.pagination ?? {},
    };
  } catch (error) {
    console.error('Get subscribers error:', error);
    return {
      success: false,
      message: 'Network error',
      totalCount: 0,
      subscribers: [],
      pagination: {},
    };
  }
};

// ==========================================
// ✅ PUBLIC — SUBSCRIBE
// ==========================================
export const subscribe = async ({ name, email }) => {
  try {
    const res = await fetch('/api/subscribers/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    return await res.json();
  } catch (error) {
    console.error('Subscribe error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

// ==========================================
// ✅ ADMIN — GET SINGLE SUBSCRIBER
// ==========================================
export const getSubscriber = async (id) => {
  try {
    const res = await fetch(`/api/subscribers/get?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error('Get subscriber error:', error);
    return { success: false, message: 'Network error' };
  }
};


// ==========================================
// ✅ ADMIN — DELETE SUBSCRIBER
// ==========================================
export const deleteSubscriber = async (id) => {
  try {
    const res = await fetch(`/api/subscribers/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return { success: false, message: 'Network error' };
  }
};