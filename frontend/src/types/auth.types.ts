export interface User {
  id: string
  username: string
  email: string
  phone: string
  role: 'USER' | 'ADMIN'
  balance: number
  kycVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  phone: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}
