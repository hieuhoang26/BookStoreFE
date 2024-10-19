import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/signup'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH = 'auth/refresh'

const authApi = {
  registerAccount(body: { username: string; email: string; password: string; phoneNumber: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login(body: { username: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  // refresh(token: string) {
  //   return http.post<AuthResponse>(URL_REFRESH, { refreshToken: token })
  // },
  logout() {
    return http.post(URL_LOGOUT)
  }
}

export default authApi
