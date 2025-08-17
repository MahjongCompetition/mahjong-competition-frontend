import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  qq: string
  nickname: string
  mahjongId: string
  mahjongNickname: string
  isActive: boolean
  lastLoginTime: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  username: string
  email: string
  name: string
  role: string
  isActive: boolean
  lastLoginTime: string
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const admin = ref<Admin | null>(null)
  const userToken = ref<string | null>(null)
  const adminToken = ref<string | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!user.value && !!userToken.value)
  const isAdmin = computed(() => !!admin.value && !!adminToken.value)
  const currentUser = computed(() => user.value)
  const currentAdmin = computed(() => admin.value)

  // 用户登录
  const loginUser = (userData: User, token: string) => {
    user.value = userData
    userToken.value = token
    localStorage.setItem('userToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  // 管理员登录
  const loginAdmin = (adminData: Admin, token: string) => {
    admin.value = adminData
    adminToken.value = token
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminData', JSON.stringify(adminData))
  }

  // 用户登出
  const logoutUser = () => {
    user.value = null
    userToken.value = null
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
  }

  // 管理员登出
  const logoutAdmin = () => {
    admin.value = null
    adminToken.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
  }

  // 初始化状态（从localStorage恢复）
  const initializeAuth = () => {
    const storedUserToken = localStorage.getItem('userToken')
    const storedAdminToken = localStorage.getItem('adminToken')
    const storedUserData = localStorage.getItem('userData')
    const storedAdminData = localStorage.getItem('adminData')

    if (storedUserToken && storedUserData) {
      userToken.value = storedUserToken
      user.value = JSON.parse(storedUserData)
    }

    if (storedAdminToken && storedAdminData) {
      adminToken.value = storedAdminToken
      admin.value = JSON.parse(storedAdminData)
    }
  }

  // 获取用户token
  const getUserToken = () => userToken.value

  // 获取管理员token
  const getAdminToken = () => adminToken.value

  return {
    // 状态
    user,
    admin,
    userToken,
    adminToken,
    
    // 计算属性
    isLoggedIn,
    isAdmin,
    currentUser,
    currentAdmin,
    
    // 方法
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
    initializeAuth,
    getUserToken,
    getAdminToken
  }
})
