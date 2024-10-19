import { DetailProduct, Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'book'
const URL1 = 'book/page'
const URL2 = 'book/detail'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL1, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<DetailProduct>>(`${URL2}/${id}`)
  },
  createProduct(shopId: number, formData: FormData) {
    return http.post(`${URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        shopId: shopId
      }
    })
  },
  updateProduct(bookId: number, formData: FormData) {
    return http.put(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        bookId: bookId
      }
    })
  },
  deleteProduct(bookId: number) {
    return http.delete(`${URL}`, {
      params: {
        bookId: bookId
      }
    })
  }
}

export default productApi
