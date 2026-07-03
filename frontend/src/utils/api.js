import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
})

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401 with notification
let sessionToastShown = false
let suppress401Redirect = false
export const setSuppress401Redirect = (v) => { suppress401Redirect = v }
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const detail = err.response?.data?.detail || ''
      const token = localStorage.getItem('token')
      if (token && !sessionToastShown) {
        sessionToastShown = true
        const isSessionExpired = detail.toLowerCase().includes('session')
        import('react-hot-toast').then((m) => {
          m.default.error(isSessionExpired ? 'Session expired. Logged in on another device.' : 'Session expired. Please log in again.', { duration: 4000 })
        })
        setTimeout(() => { sessionToastShown = false }, 5000)
      }
      localStorage.removeItem('token')
      if (!suppress401Redirect) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  updateProfile: (data) => api.put('/auth/me', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  sessions: () => api.get('/auth/sessions'),
  revokeSession: (id) => api.delete(`/auth/sessions/${id}`),
  loginHistory: () => api.get('/auth/login-history'),
}

// ── Tests ─────────────────────────────────────────────────────────────────────
export const testsApi = {
  listAll:      (params) => api.get('/tests/all', { params }),
  listBooks:    (params) => api.get('/tests/books', { params }),
  listTests:    (bookId) => api.get(`/tests/books/${bookId}/tests`),
  getReading:   (testId) => api.get(`/tests/${testId}/reading`),
  getListening: (testId) => api.get(`/tests/${testId}/listening`),
  getWriting:   (testId) => api.get(`/tests/${testId}/writing`),
  getSpeaking:  (testId) => api.get(`/tests/${testId}/speaking`),
}

// ── Sessions ──────────────────────────────────────────────────────────────────
export const sessionsApi = {
  start:  (data) => api.post('/sessions/start', data),
  submit: (data) => api.post('/sessions/submit', data),
  my:     ()     => api.get('/sessions/my'),
  get:    (id)   => api.get(`/sessions/${id}`),
}

// ── Submissions ───────────────────────────────────────────────────────────────
export const submissionsApi = {
  submitWriting:  (data) => api.post('/submissions/writing', data),
  myWriting:      ()     => api.get('/submissions/writing'),
  getWriting:     (id)   => api.get(`/submissions/writing/${id}`),
  submitSpeaking: (data) => api.post('/submissions/speaking', data),
  mySpeaking:     ()     => api.get('/submissions/speaking/my'),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
}

// ── Vocabulary ────────────────────────────────────────────────────────────────
export const vocabApi = {
  list:   ()     => api.get('/vocabulary/'),
  star:   (data) => api.post('/vocabulary/star', data),
  unstar: (id)   => api.delete(`/vocabulary/${id}`),
}

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  plans:           ()     => api.get('/payments/plans'),
  initiateEsewa:   (data) => api.post('/payments/esewa/initiate', data),
  verifyEsewa:     (paymentId, data) => api.post(`/payments/esewa/verify?payment_id=${paymentId}`, data),
  initiateKhalti:  (data) => api.post('/payments/khalti/initiate', data),
  verifyKhalti:    (pidx, paymentId) => api.post(`/payments/khalti/verify?pidx=${pidx}&payment_id=${paymentId}`),
  history:         ()     => api.get('/payments/history'),
}

// ── Subscription Requests ─────────────────────────────────────────────────
export const subscriptionApi = {
  uploadScreenshot: (file, gateway, planType) => {
    const form = new FormData()
    form.append('file', file)
    if (gateway) form.append('gateway', gateway)
    if (planType) form.append('plan_type', planType)
    return api.post('/subscription-requests/upload', form)
  },
  myRequests: () => api.get('/subscription-requests/my'),
  adminList:  () => api.get('/admin/subscription-requests'),
  approve:    (id) => api.put(`/admin/subscription-requests/${id}/approve`),
  reject:     (id) => api.put(`/admin/subscription-requests/${id}/reject`),
  update:     (id, data) => api.put(`/admin/subscription-requests/${id}`, data),
  delete:     (id) => api.delete(`/admin/subscription-requests/${id}`),
}

// ── Mock Test ───────────────────────────────────────────────────────────────
export const mockTestApi = {
  submit: (data) => api.post('/mock-test/submit', data),
  my:     ()     => api.get('/mock-test/my'),
  get:    (id)   => api.get(`/mock-test/${id}`),
  stats:  ()     => api.get('/mock-test/stats'),
}

// ── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (name, email, subject, message, file) => {
    const form = new FormData()
    form.append('name', name)
    form.append('email', email)
    form.append('subject', subject)
    form.append('message', message)
    if (file) form.append('screenshot', file)
    return api.post('/contact', form)
  },
}

// ── Admin Plans ──────────────────────────────────────────────────────────────
export const adminPlansApi = {
  list:   ()     => api.get('/admin/plans'),
  create: (data) => api.post('/admin/plans', data),
  update: (id, data) => api.put(`/admin/plans/${id}`, data),
  delete: (id)   => api.delete(`/admin/plans/${id}`),
}

// ── Enterprise Members ──────────────────────────────────────────────────────
export const enterpriseApi = {
  status: () => api.get('/enterprise/status'),
  members: {
    list:  ()     => api.get('/enterprise/members'),
    add:   (data) => api.post('/enterprise/members', data),
    remove:(id)   => api.delete(`/enterprise/members/${id}`),
  },
}

export default api
