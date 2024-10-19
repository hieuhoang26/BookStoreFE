import { User } from './user.type'
import { SuccessResponse } from './utils.type'

// export type AuthResponse = SuccessResponse<{
//   accessToken: string
//   refreshToken: string
//   user: User
//   expires_refresh_token: number
//   expires: number
// }>
type Role = 'ROLE_User' | 'ROLE_Admin' | 'ROLE_Shop'
export type AuthResponse = {
  // accessToken: string
  // refreshToken: string
  // user: User
  // expires_refresh_token: number
  // message: string
  // expires: number
  accessToken: string
  refreshToken: string
  // user: User
  expires: number
  id: number
  username: string
  shopId?: number
  roles: Role[]
}
export type RefreshTokenReponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
}
