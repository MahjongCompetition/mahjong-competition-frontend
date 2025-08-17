import api, { apiUtils } from './index'
import type { ApiResponse } from './index'

// 比赛类型
export interface Competition {
  id: number
  competitionName: string
  description: string
  competitionType: 'TEAM' | 'INDIVIDUAL'
  maxParticipants: number
  rule: CompetitionRule
  registrationStartTime: string
  registrationDeadline: string
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
  registrationClosed: boolean
}

// 比赛规则
export interface CompetitionRule {
  id: number
  ruleName: string
  originPoints: number
  firstPlacePoints: number
  secondPlacePoints: number
  thirdPlacePoints: number
  fourthPlacePoints: number
  createdAt: string
  updatedAt: string
}

// 比赛创建请求
export interface CompetitionCreateRequest {
  name: string
  description?: string
  type: 'INDIVIDUAL' | 'TEAM'
  maxParticipants?: number
  registrationStartTime?: string
  registrationEndTime: string
  startTime?: string
  endTime?: string
  ruleId: number
}

// 比赛状态响应
export interface CompetitionStatusResponse {
  competitionId: number
  roundNumber: number
  competitionName: string
  competitionType: string
  playerStatusList: PlayerStatusInfo[]
  teamStatusList: TeamStatusInfo[]
}

// 玩家状态信息
export interface PlayerStatusInfo {
  playerId: number
  playerName: string
  username: string
  initialScore: number
  currentRoundScore: number
  totalScore: number
  appearanceCount: number
  averagePosition: number
  firstPlaceCount: number
  secondPlaceCount: number
  thirdPlaceCount: number
  fourthPlaceCount: number
  status: string
}

// 团队状态信息
export interface TeamStatusInfo {
  teamId: number
  teamName: string
  teamCode: string
  initialScore: number
  currentRoundScore: number
  totalScore: number
  appearanceCount: number
  averagePosition: number
  firstPlaceCount: number
  secondPlaceCount: number
  thirdPlaceCount: number
  fourthPlaceCount: number
  status: string
  memberScores: TeamMemberScore[]
  playerStatusList: PlayerStatusInfo[]
}

// 团队成员得分
export interface TeamMemberScore {
  playerId: number
  playerName: string
  username: string
  individualScore: number
}

// 比赛API
export const competitionApi = {
  // 获取所有比赛
  getAll: async (): Promise<Competition[]> => {
    const response = await api.get<ApiResponse<Competition[]>>('/api/competitions')
    return apiUtils.handleResponse(response)
  },

  // 根据ID获取比赛
  getById: async (id: number): Promise<Competition> => {
    const response = await api.get<ApiResponse<Competition>>(`/api/competitions/${id}`)
    return apiUtils.handleResponse(response)
  },

  // 根据名称获取比赛
  getByName: async (name: string): Promise<Competition> => {
    const response = await api.get<ApiResponse<Competition>>(`/api/competitions/name/${name}`)
    return apiUtils.handleResponse(response)
  },

  // 根据类型获取比赛
  getByType: async (type: string): Promise<Competition[]> => {
    const response = await api.get<ApiResponse<Competition[]>>(`/api/competitions/type/${type}`)
    return apiUtils.handleResponse(response)
  },

  // 搜索比赛
  search: async (name: string): Promise<Competition[]> => {
    const response = await api.get<ApiResponse<Competition[]>>(`/api/competitions/search?competitionName=${name}`)
    return apiUtils.handleResponse(response)
  },

  // 根据规则获取比赛
  getByRule: async (ruleId: number): Promise<Competition[]> => {
    const response = await api.get<ApiResponse<Competition[]>>(`/api/competitions/rule/${ruleId}`)
    return apiUtils.handleResponse(response)
  },

  // 创建比赛
  create: async (data: CompetitionCreateRequest): Promise<Competition> => {
    const response = await api.post<ApiResponse<Competition>>('/api/competitions/create', data)
    return apiUtils.handleResponse(response)
  },

  // 更新比赛
  update: async (id: number, data: Partial<Competition>): Promise<Competition> => {
    const response = await api.put<ApiResponse<Competition>>(`/api/competitions/${id}`, data)
    return apiUtils.handleResponse(response)
  },

  // 删除比赛
  delete: async (id: number): Promise<string> => {
    const response = await api.delete<ApiResponse<string>>(`/api/competitions/${id}`)
    return apiUtils.handleResponse(response)
  },

  // 获取比赛状态
  getStatus: async (competitionId: number, roundNumber: number): Promise<CompetitionStatusResponse> => {
    const response = await api.get<ApiResponse<CompetitionStatusResponse>>(`/api/competition-status/${competitionId}/round/${roundNumber}`)
    return apiUtils.handleResponse(response)
  },

  // 获取当前轮次状态
  getCurrentRoundStatus: async (competitionId: number): Promise<CompetitionStatusResponse> => {
    const response = await api.get<ApiResponse<CompetitionStatusResponse>>(`/api/competition-status/${competitionId}/current`)
    return apiUtils.handleResponse(response)
  }
}

// 比赛规则API
export const competitionRuleApi = {
  // 获取所有规则
  getAll: async (): Promise<CompetitionRule[]> => {
    const response = await api.get<ApiResponse<CompetitionRule[]>>('/api/competition-rules')
    return apiUtils.handleResponse(response)
  },

  // 根据ID获取规则
  getById: async (id: number): Promise<CompetitionRule> => {
    const response = await api.get<ApiResponse<CompetitionRule>>(`/api/competition-rules/${id}`)
    return apiUtils.handleResponse(response)
  },

  // 根据名称获取规则
  getByName: async (name: string): Promise<CompetitionRule> => {
    const response = await api.get<ApiResponse<CompetitionRule>>(`/api/competition-rules/name/${name}`)
    return apiUtils.handleResponse(response)
  },

  // 搜索规则
  search: async (name: string): Promise<CompetitionRule[]> => {
    const response = await api.get<ApiResponse<CompetitionRule[]>>(`/api/competition-rules/search?ruleName=${name}`)
    return apiUtils.handleResponse(response)
  },

  // 创建规则
  create: async (data: Partial<CompetitionRule>): Promise<CompetitionRule> => {
    const response = await api.post<ApiResponse<CompetitionRule>>('/api/competition-rules', data)
    return apiUtils.handleResponse(response)
  },

  // 更新规则
  update: async (id: number, data: Partial<CompetitionRule>): Promise<CompetitionRule> => {
    const response = await api.put<ApiResponse<CompetitionRule>>(`/api/competition-rules/${id}`, data)
    return apiUtils.handleResponse(response)
  },

  // 删除规则
  delete: async (id: number): Promise<string> => {
    const response = await api.delete<ApiResponse<string>>(`/api/competition-rules/${id}`)
    return apiUtils.handleResponse(response)
  }
}
