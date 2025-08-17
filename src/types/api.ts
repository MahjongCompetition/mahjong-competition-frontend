// API 响应类型定义
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

// 登录响应类型
export interface LoginResponse {
  token: string
}

// 用户登录响应
export interface UserLoginResponse {
  user: any
  token: string
}

// 管理员登录响应
export interface AdminLoginResponse {
  admin: any
  token: string
}
