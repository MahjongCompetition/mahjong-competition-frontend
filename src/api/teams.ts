import api from './index'
import type { ApiResponse } from '../types/api'

// 团队相关类型定义
export interface Team {
  id: number
  teamName: string
  teamCode: string
  captainId: number
  maxMembers: number
  currentMembers: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: number
  teamId: number
  player: {
    id: number
    username: string
    nickname: string
    qq: string
    mahjongId: string
    mahjongNickname: string
  }
  joinTime: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamCreateRequest {
  teamName: string
  maxMembers: number
}

export interface TeamOperationRequest {
  teamId: number
  teamCode?: string
}

export interface TeamInfo {
  id: number
  name: string
  code: string
  description: string
  captainId: number
  captainName: string
  createdByMe: boolean
}

export interface PlayerTeamsResponse {
  teams: TeamInfo[]
}

// 团队管理API
export const teamsApi = {
  // 创建团队
  create: async (teamData: TeamCreateRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/teams/create', teamData)
      return response as unknown as ApiResponse
    } catch (error) {
      console.error('创建团队失败:', error)
      throw error
    }
  },

  // 加入团队
  join: async (teamCode: string): Promise<Team> => {
    try {
      const response = await api.post<ApiResponse<Team>>('/api/teams/join', { teamCode })
      const apiResponse = response as unknown as ApiResponse<Team>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '加入团队失败')
      }
    } catch (error) {
      console.error('加入团队失败:', error)
      throw error
    }
  },

  // 退出团队
  leave: async (teamId: number): Promise<string> => {
    try {
      const response = await api.post<ApiResponse<string>>('/api/teams/leave', { teamId })
      const apiResponse = response as unknown as ApiResponse<string>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '退出团队失败')
      }
    } catch (error) {
      console.error('退出团队失败:', error)
      throw error
    }
  },

  // 解散团队
  dissolve: async (teamId: number): Promise<string> => {
    try {
      const response = await api.post<ApiResponse<string>>('/api/teams/dissolve', { teamId })
      const apiResponse = response as unknown as ApiResponse<string>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '解散团队失败')
      }
    } catch (error) {
      console.error('解散团队失败:', error)
      throw error
    }
  },

  // 获取团队成员
  getMembers: async (teamId: number): Promise<TeamMember[]> => {
    try {
      const response = await api.get<ApiResponse<TeamMember[]>>(`/api/teams/${teamId}/members`)
      const apiResponse = response as unknown as ApiResponse<TeamMember[]>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取团队成员失败')
      }
    } catch (error) {
      console.error('获取团队成员失败:', error)
      throw error
    }
  },

  // 检查是否为团队成员
  isMember: async (teamId: number, playerId: number): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<boolean>>(`/api/teams/${teamId}/is-member/${playerId}`)
      const apiResponse = response as unknown as ApiResponse<boolean>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '检查成员身份失败')
      }
    } catch (error) {
      console.error('检查成员身份失败:', error)
      throw error
    }
  },

  // 检查是否为队长
  isCaptain: async (teamId: number, playerId: number): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<boolean>>(`/api/teams/${teamId}/is-captain/${playerId}`)
      const apiResponse = response as unknown as ApiResponse<boolean>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '检查队长身份失败')
      }
    } catch (error) {
      console.error('检查队长身份失败:', error)
      throw error
    }
  },

  // 根据玩家ID获取团队
  getTeamByPlayer: async (playerId: number): Promise<Team> => {
    try {
      const response = await api.get<ApiResponse<Team>>(`/api/teams/player/${playerId}`)
      const apiResponse = response as unknown as ApiResponse<Team>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取玩家团队失败')
      }
    } catch (error) {
      console.error('获取玩家团队失败:', error)
      throw error
    }
  },

  // 根据团队码获取团队
  getTeamByCode: async (teamCode: string): Promise<Team> => {
    try {
      const response = await api.get<ApiResponse<Team>>(`/api/teams/code/${teamCode}`)
      const apiResponse = response as unknown as ApiResponse<Team>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取团队信息失败')
      }
    } catch (error) {
      console.error('获取团队信息失败:', error)
      throw error
    }
  },

  // 根据队长ID获取团队
  getTeamsByCaptain: async (captainId: number): Promise<Team[]> => {
    try {
      const response = await api.get<ApiResponse<Team[]>>(`/api/teams/captain/${captainId}`)
      const apiResponse = response as unknown as ApiResponse<Team[]>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取队长团队失败')
      }
    } catch (error) {
      console.error('获取队长团队失败:', error)
      throw error
    }
  }
}

// 玩家团队API
export const playerTeamsApi = {
  // 获取我的团队
  getMyTeams: async (type?: string): Promise<PlayerTeamsResponse> => {
    try {
      const url = type ? `/api/player/my-teams?type=${type}` : '/api/player/my-teams'
      const response = await api.get<ApiResponse<PlayerTeamsResponse>>(url)
      const apiResponse = response as unknown as ApiResponse<PlayerTeamsResponse>
      
      if (apiResponse.code === 0) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.message || '获取我的团队失败')
      }
    } catch (error) {
      console.error('获取我的团队失败:', error)
      throw error
    }
  }
}
