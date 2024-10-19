import { CartResponse } from 'src/types/cart.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'cart'
const cartApi = {
  addToCart(body: { userId: number; bookId: number; quantity: number }) {
    return http.post(`${URL}`, body)
  },

  getCart(userId: number) {
    return http.get<SuccessResponse<CartResponse>>(`${URL}/${userId}`)
  },
  deleteCartItem(params: { userId: number; bookId: number[] }) {
    const { userId, bookId } = params
    const bookIds = bookId.join(',')
    return http.delete(`${URL}?userId=${userId}&bookId=${bookIds}`)
  }

  // deleteCart(id: number) {
  //   return http.delete(`${URL}/${id}`)
  // }
}

export default cartApi
