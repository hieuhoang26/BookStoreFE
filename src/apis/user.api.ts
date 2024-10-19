import { User, UserInfo } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const url = 'user'

const userApi = {
  getProfile(id: number) {
    return http.get<SuccessResponse<UserInfo>>(`${url}/${id}`)
  },
  // updateProfile(body: BodyUpdateProfile) {
  //   return http.put<SuccessResponse<User>>(url, body)
  // }
  updateProfile(id: number, formData: FormData) {
    return http.put(`${url}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  //   uploadAvatar(body: FormData) {
  //     return http.post<SuccessResponse<string>>('user/upload-avatar', body, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
  //   }
}

export default userApi
