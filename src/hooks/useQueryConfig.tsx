import { ProductListConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParam'
import { isUndefined, omitBy } from 'lodash'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      pageNo: queryParams.pageNo || '1',
      pageSize: queryParams.pageSize || '5',
      sortBy: queryParams.sortBy,
      // exclude: queryParams.exclude,
      name: queryParams.name,
      maxPrice: queryParams.maxPrice,
      minPrice: queryParams.minPrice,
      //   rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
