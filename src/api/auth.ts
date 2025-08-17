import api from './index'
import type { ApiResponse } from './index'
import type { User, Admin } from '@/stores/auth'

// 用户认证API
export const userAuthApi = {
  // 用户注册
  register: async (userData: Partial<User>): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/api/player/register', userData)
    return response as unknown as ApiResponse
  },

  // 用户登录
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<string>>('/api/player/login', { username, password }) as unknown as ApiResponse<string>
    
    // 检查响应状态
    if (response.code === 0) {
      const token = response.data
      
      // 登录成功后，获取用户信息
      try {
        const userProfile = await userAuthApi.getProfile()
        return {
          user: userProfile,
          token: token
        }
      } catch (error) {
        // 如果获取用户信息失败，创建一个基础用户对象
        const baseUser: User = {
          id: 0, // 临时ID，后续会更新
          username: username,
          nickname: username,
          qq: '',
          mahjongId: '',
          mahjongNickname: '',
          isActive: true,
          lastLoginTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return {
          user: baseUser,
          token: token
        }
      }
    } else {
      throw new Error(response.message || '登录失败')
    }
  },

  // 获取用户信息
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/player/profile')
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '获取用户信息失败')
    }
  },

  // 更新用户信息
  updateProfile: async (userId: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/api/player/${userId}`, userData)
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '更新用户信息失败')
    }
  },

  // 修改密码
  changePassword: async (userId: number, oldPassword: string, newPassword: string): Promise<User> => {
    const response = await api.post<ApiResponse<User>>(`/api/player/${userId}/change-password`, {
      oldPassword,
      newPassword
    })
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '修改密码失败')
    }
  },

  // 检查用户名可用性
  checkUsername: async (username: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-username?username=${username}`)
    if (response.code === 0) {
      return response.data[username] || false
    } else {
      throw new Error(response.message || '检查用户名失败')
    }
  },

  // 检查QQ可用性
  checkQq: async (qq: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-qq?qq=${qq}`)
    if (response.code === 0) {
      return response.data[qq] || false
    } else {
      throw new Error(response.message || '检查QQ失败')
    }
  },

  // 检查麻将ID可用性
  checkMahjongId: async (mahjongId: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-mahjong-id?mahjongId=${mahjongId}`)
    if (response.code === 0) {
      return response.data[mahjongId] || false
    } else {
      throw new Error(response.message || '检查麻将ID失败')
    }
  }
}

// 管理员认证API
export const adminAuthApi = {
  // 管理员登录
  login: async (username: string, password: string): Promise<{ admin: Admin; token: string }> => {
    const response = await api.post<ApiResponse<string>>('/api/admin/login', { username, password })
    
    if (response.code === 0) {
      const token = response.data
      
      // 登录成功后，获取管理员信息
      try {
        const adminProfile = await adminAuthApi.getById(0) // 临时ID，后续会更新
        return {
          admin: adminProfile,
          token: token
        }
      } catch (error) {
        // 如果获取管理员信息失败，创建一个基础管理员对象
        const baseAdmin: Admin = {
          id: 0, // 临时ID，后续会更新
          username: username,
          name: username,
          role: 'ADMIN',
          email: '',
          isActive: true,
          lastLoginTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return {
          admin: baseAdmin,
          token: token
        }
      }
    } else {
      throw new Error(response.message || '登录失败')
    }
  },

  // 创建管理员
  create: async (adminData: Partial<Admin>): Promise<Admin> => {
    const response = await api.post<ApiResponse<Admin>>('/api/admin/create', adminData)
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '创建管理员失败')
    }
  },

  // 获取管理员信息
  getById: async (adminId: number): Promise<Admin> => {
    const response = await api.get<ApiResponse<Admin>>(`/api/admin/${adminId}`)
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '获取管理员信息失败')
    }
  },

  // 更新管理员信息
  update: async (adminId: number, adminData: Partial<Admin>): Promise<Admin> => {
    const response = await api.put<ApiResponse<Admin>>(`/api/admin/${adminId}`, adminData)
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '更新管理员信息失败')
    }
  },

  // 修改管理员密码
  changePassword: async (adminId: number, oldPassword: string, newPassword: string): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(`/api/admin/${adminId}/change-password`, {
      oldPassword,
      newPassword
    })
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '修改密码失败')
    }
  },

  // 切换管理员状态
  toggleStatus: async (adminId: number): Promise<Admin> => {
    const response = await api.patch<ApiResponse<Admin>>(`/api/admin/${adminId}/toggle-status`)
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '切换状态失败')
    }
  },

  // 获取所有管理员
  getAll: async (): Promise<Admin[]> => {
    const response = await api.get<ApiResponse<Admin[]>>('/api/admin/list')
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '获取管理员列表失败')
    }
  },

  // 获取活跃管理员
  getActive: async (): Promise<Admin[]> => {
    const response = await api.get<ApiResponse<Admin[]>>('/api/admin/active')
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '获取活跃管理员失败')
    }
  },

  // 检查是否有超级管理员
  hasSuperAdmin: async (): Promise<boolean> => {
    const response = await api.get<ApiResponse<boolean>>('/api/admin/has-super-admin')
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '检查超级管理员失败')
    }
  },

  // 初始化超级管理员
  initializeSuperAdmin: async (password: string): Promise<Admin> => {
    const response = await api.post<ApiResponse<Admin>>('/api/admin/initialize-super-admin', { password })
    if (response.code === 0) {
      return response.data
    } else {
      throw new Error(response.message || '初始化超级管理员失败')
    }
  }
}
