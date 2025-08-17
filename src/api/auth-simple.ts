import api from './index'
import type { ApiResponse, UserLoginResponse, AdminLoginResponse } from '../types/api'
import type { User, Admin } from '@/stores/auth'

// 用户认证API
export const userAuthApi = {
  // 用户登录
  login: async (username: string, password: string): Promise<UserLoginResponse> => {
    try {
      const response = await api.post<ApiResponse<string>>('/api/player/login', { username, password })
      
      // 由于响应拦截器已经处理了Axios响应，这里直接使用response
      const apiResponse = response as unknown as ApiResponse<string>
      
      if (apiResponse.code === 0) {
        const token = apiResponse.data
        
        // 创建基础用户对象（后续可以通过获取用户信息接口来完善）
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
      } else {
        throw new Error(apiResponse.message || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  },

  // 用户注册
  register: async (userData: Partial<User>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/player/register', userData)
      return response as unknown as ApiResponse
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  },

  // 获取用户信息
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>('/api/player/profile')
      const apiResponse = response as unknown as ApiResponse<User>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  },

  // 更新用户信息
  updateProfile: async (userId: number, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/api/player/${userId}`, userData)
      const apiResponse = response as unknown as ApiResponse<User>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '更新用户信息失败')
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  },

  // 修改密码
  changePassword: async (userId: number, oldPassword: string, newPassword: string): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(`/api/player/${userId}/change-password`, {
        oldPassword,
        newPassword
      })
      const apiResponse = response as unknown as ApiResponse<User>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '修改密码失败')
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      throw error
    }
  },

  // 检查用户名可用性
  checkUsername: async (username: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-username?username=${username}`)
      const apiResponse = response as unknown as ApiResponse<Record<string, boolean>>
      
      if (apiResponse.code === 0) {
        return apiResponse.data[username] || false
      } else {
        throw new Error(apiResponse.message || '检查用户名失败')
      }
    } catch (error) {
      console.error('检查用户名失败:', error)
      throw error
    }
  },

  // 检查QQ可用性
  checkQq: async (qq: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-qq?qq=${qq}`)
      const apiResponse = response as unknown as ApiResponse<Record<string, boolean>>
      
      if (apiResponse.code === 0) {
        return apiResponse.data[qq] || false
      } else {
        throw new Error(apiResponse.message || '检查QQ失败')
      }
    } catch (error) {
      console.error('检查QQ失败:', error)
      throw error
    }
  },

  // 检查麻将ID可用性
  checkMahjongId: async (mahjongId: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<Record<string, boolean>>>(`/api/player/check-mahjong-id?mahjongId=${mahjongId}`)
      const apiResponse = response as unknown as ApiResponse<Record<string, boolean>>
      
      if (apiResponse.code === 0) {
        return apiResponse.data[mahjongId] || false
      } else {
        throw new Error(apiResponse.message || '检查麻将ID失败')
      }
    } catch (error) {
      console.error('检查麻将ID失败:', error)
      throw error
    }
  }
}

// 管理员认证API
export const adminAuthApi = {
  // 管理员登录
  login: async (username: string, password: string): Promise<AdminLoginResponse> => {
    try {
      const response = await api.post<ApiResponse<string>>('/api/admin/login', { username, password })
      
      const apiResponse = response as unknown as ApiResponse<string>
      
      if (apiResponse.code === 0) {
        const token = apiResponse.data
        
        // 创建基础管理员对象
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
      } else {
        throw new Error(apiResponse.message || '登录失败')
      }
    } catch (error) {
      console.error('管理员登录失败:', error)
      throw error
    }
  },

  // 获取管理员信息
  getById: async (adminId: number): Promise<Admin> => {
    try {
      const response = await api.get<ApiResponse<Admin>>(`/api/admin/${adminId}`)
      const apiResponse = response as unknown as ApiResponse<Admin>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取管理员信息失败')
      }
    } catch (error) {
      console.error('获取管理员信息失败:', error)
      throw error
    }
  },

  // 更新管理员信息
  update: async (adminId: number, adminData: Partial<Admin>): Promise<Admin> => {
    try {
      const response = await api.put<ApiResponse<Admin>>(`/api/admin/${adminId}`, adminData)
      const apiResponse = response as unknown as ApiResponse<Admin>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '更新管理员信息失败')
      }
    } catch (error) {
      console.error('更新管理员信息失败:', error)
      throw error
    }
  }
}
