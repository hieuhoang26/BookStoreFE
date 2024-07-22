import { Product, ProductList, ProductListConfig, ImageList } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

// const URL = 'products'
const URL = 'book/page'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getLocalImg() {
    return http.get<SuccessResponse<ImageList>>('/images/')
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
