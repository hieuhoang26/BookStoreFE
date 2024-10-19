type Role = 'ROLE_User' | 'ROLE_Admin' | 'ROLE_Shop'

export interface User {
  id: number
  username?: string
  shopId?: number
  roles: Role[]
  // email: string
  // date_of_birth?: string // ISO 8610
  // avatar?: string
  // address?: string
  // phone?: string
  // createdAt: string
  // updatedAt: string
}
export interface UserInfo {
  id: number
  username?: string
  // roles: Role[]
  email: string
  dateOfBirth?: string // ISO 8610
  avatar?: string
  // address?: string
  phoneNumber?: string
}
