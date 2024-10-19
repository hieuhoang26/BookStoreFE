import { OrderResponse, Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'order'

const purchaseApi = {
  getPurchasesForShop(shopId: number) {
    return http.get<SuccessResponse<OrderResponse[]>>(`${URL}`, {
      params: {
        shopId: shopId
      }
    })
  },
  buyProducts(body: {
    userId: number
    totalPrice: number
    address: string
    statusOrder: number
    orderItems: {
      bookId: number
      shopId: number
      quantity: number
    }[]
  }) {
    return http.post(`${URL}`, body)
  },
  changeStatus(orderId: number, status: number) {
    // return http.patch(`${URL}`, {
    //   params: {
    //     orderId: orderId,
    //     status: status
    //   }
    // })
    return http.patch(`${URL}?orderId=${orderId}&status=${status}`)
  },
  // updatePurchase(body: { product_id: string; buy_count: number }) {
  //   return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  // },
  deletePurchase(orderId: number) {
    return http.delete(`${URL}`, {
      params: {
        orderId: orderId
      }
    })
  }
}

export default purchaseApi
