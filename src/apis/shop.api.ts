import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { ShopInfo } from 'src/types/shop.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL1 = '/shop'
const URL2 = '/book/shop'
const shopApi = {
  getShopInfo(id: number) {
    return http.get<SuccessResponse<ShopInfo>>(`${URL1}/${id}`)
  },
  // getProductsForShop(params: ProductListConfig) {
  //   return http.get<SuccessResponse<ProductList>>(URL1, {
  //     params
  //   })
  // }
  getProductsForShop(id: number) {
    return http.get<SuccessResponse<Product>>(`${URL2}/${id}`)
  }
}

export default shopApi
