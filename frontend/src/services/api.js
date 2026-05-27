const API_BASE = import.meta.env.VITE_API_URL || 'https://clinic-api-henna.vercel.app/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')
  const headers = { ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  } catch (err) {
    if (err.message === 'Failed to fetch') throw new Error('تعذر الاتصال بالخادم')
    throw err
  }
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  verify: () => request('/auth/verify'),
}

export const bookingApi = {
  create: (data) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkAvailability: (date) =>
    request(`/bookings/availability?date=${date}`),
}

export const adminApi = {
  getBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/admin/bookings${q ? `?${q}` : ''}`)
  },
  getBooking: (id) => request(`/admin/bookings/${id}`),
  updateStatus: (id, status) =>
    request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteBooking: (id) =>
    request(`/admin/bookings/${id}`, { method: 'DELETE' }),
  getAnalytics: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/admin/analytics${q ? `?${q}` : ''}`)
  },
}
