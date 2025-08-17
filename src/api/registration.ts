import api, { apiUtils } from './index'
import type { ApiResponse } from './index'
import type { Competition } from './competition'
import type { Team } from './teams'

// 个人比赛报名
export interface PlayerCompetitionRegistration {
  id: number
  player: {
    id: number
    username: string
    nickname: string
    qq: string
    mahjongId: string
    mahjongNickname: string
  }
  competition: Competition
  status: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED' | 'WITHDRAWN'
  registrationTime: string
  createdAt: string
  updatedAt: string
}

// 团队比赛报名
export interface TeamCompetitionRegistration {
  id: number
  team: Team
  competition: Competition
  status: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED' | 'WITHDRAWN'
  registrationTime: string
  createdAt: string
  updatedAt: string
}

// 个人比赛报名请求
export interface CompetitionRegistrationRequest {
  competitionId: number
}

// 团队比赛报名请求
export interface TeamCompetitionRegistrationRequest {
  competitionId: number
  teamId: number
}

// 比赛报名API
export const registrationApi = {
  // 个人报名比赛
  registerPlayer: async (request: CompetitionRegistrationRequest): Promise<PlayerCompetitionRegistration> => {
    const response = await api.post<ApiResponse<PlayerCompetitionRegistration>>('/api/player-competition-registrations/register', request)
    return apiUtils.handleResponse(response)
  },

  // 团队报名比赛
  registerTeam: async (request: TeamCompetitionRegistrationRequest): Promise<TeamCompetitionRegistration> => {
    const response = await api.post<ApiResponse<TeamCompetitionRegistration>>('/api/player-competition-registrations/register-team', request)
    return apiUtils.handleResponse(response)
  },

  // 取消报名
  cancelRegistration: async (request: CompetitionRegistrationRequest): Promise<string> => {
    const response = await api.post<ApiResponse<string>>('/api/player-competition-registrations/cancel', request)
    return apiUtils.handleResponse(response)
  },

  // 获取玩家的报名记录
  getPlayerRegistrations: async (playerId: number): Promise<PlayerCompetitionRegistration[]> => {
    const response = await api.get<ApiResponse<PlayerCompetitionRegistration[]>>(`/api/player-competition-registrations/player/${playerId}`)
    return apiUtils.handleResponse(response)
  },

  // 获取比赛的报名记录
  getCompetitionRegistrations: async (competitionId: number): Promise<PlayerCompetitionRegistration[]> => {
    const response = await api.get<ApiResponse<PlayerCompetitionRegistration[]>>(`/api/player-competition-registrations/competition/${competitionId}`)
    return apiUtils.handleResponse(response)
  },

  // 检查玩家是否已报名
  isPlayerRegistered: async (playerId: number, competitionId: number): Promise<boolean> => {
    const response = await api.get<ApiResponse<boolean>>(`/api/player-competition-registrations/check/${playerId}/${competitionId}`)
    return apiUtils.handleResponse(response)
  }
}
