import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // 根据请求URL判断是用户请求还是管理员请求
    if (config.url?.includes('/admin/')) {
      const adminToken = authStore.getAdminToken()
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`
      }
    } else {
      const userToken = authStore.getUserToken()
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，清除token并跳转到登录页
      const authStore = useAuthStore()
      if (error.config.url?.includes('/admin/')) {
        authStore.logoutAdmin()
        window.location.href = '/admin/login'
      } else {
        authStore.logoutUser()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// 通用API方法
export const apiUtils = {
  // 处理API响应
  handleResponse: <T>(response: ApiResponse<T>): T => {
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '请求失败')
    }
  },

  // 处理分页响应
  handlePageResponse: <T>(response: ApiResponse<PageResponse<T>>): PageResponse<T> => {
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '请求失败')
    }
  }
}
