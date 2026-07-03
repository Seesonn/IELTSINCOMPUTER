import { create } from 'zustand'
import { authApi, setSuppress401Redirect } from '../utils/api'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  initDone: false,
  loading: false,
  pendingEmail: null,

  init: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ initDone: true })
      return
    }
    setSuppress401Redirect(true)
    try {
      const { data } = await authApi.me()
      set({ user: data, initDone: true })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, user: null, initDone: true })
    } finally {
      setSuppress401Redirect(false)
    }
  },

  googleLogin: async (credential) => {
    set({ loading: true })
    try {
      const { data } = await authApi.googleLogin(credential)
      localStorage.setItem('token', data.access_token)
      set({ token: data.access_token })
      const me = await authApi.me()
      set({ user: me.data, loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Google login failed' }
    }
  },

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await authApi.login({ email, password })
      localStorage.setItem('token', data.access_token)
      set({ token: data.access_token })
      const me = await authApi.me()
      set({ user: me.data, loading: false, pendingEmail: null })
      return { success: true }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Login failed' }
    }
  },

  register: async (formData) => {
    set({ loading: true })
    try {
      const { data } = await authApi.register(formData)
      set({ loading: false, pendingEmail: data.email })
      return { success: true, email: data.email }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Registration failed' }
    }
  },

  verifyOtp: async (email, otp) => {
    set({ loading: true })
    try {
      const { data } = await authApi.verifyOtp({ email, otp })
      localStorage.setItem('token', data.access_token)
      set({ token: data.access_token })
      const me = await authApi.me()
      set({ user: me.data, loading: false, pendingEmail: null })
      return { success: true }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Verification failed' }
    }
  },

  resendOtp: async (email) => {
    set({ loading: true })
    try {
      await authApi.resendOtp({ email })
      set({ loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Failed to resend OTP' }
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // Session may already be invalidated; clear local state regardless
    }
    localStorage.removeItem('token')
    set({ user: null, token: null, pendingEmail: null })
  },

  forgotPassword: async (email) => {
    set({ loading: true })
    try {
      const { data } = await authApi.forgotPassword({ email })
      set({ loading: false })
      return { success: true, message: data.message }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Something went wrong' }
    }
  },

  resetPassword: async (token, password) => {
    set({ loading: true })
    try {
      const { data } = await authApi.resetPassword({ token, password })
      set({ loading: false })
      return { success: true, message: data.message }
    } catch (err) {
      set({ loading: false })
      return { success: false, error: err.response?.data?.detail || 'Failed to reset password' }
    }
  },

  refreshUser: async () => {
    try {
      const { data } = await authApi.me()
      set({ user: data })
    } catch {}
  },
}))

export default useAuthStore
