import { Category } from 'src/types/categories.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
const url = 'category'
const categoryApi = {
  getAllCategory() {
    return http.get<SuccessResponse<Category[]>>(url)
  }
}

export default categoryApi
