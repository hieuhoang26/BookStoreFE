import React, { useState } from 'react'
import Product from './components/Product/Product'
import SortProduct from './components/SortProduct'
import AsideFilter from './components/AsideFilter'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import useQueryParams from 'src/hooks/useQueryParam'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'

export default function ProductList() {
  // const [page, setPage] = useState(16)
  const queryParams = useQueryParams()
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    }
  })
  const { data: CategoryData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return categoryApi.getAllCategory()
    }
  })
  // console.log(CategoryData)
  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>Trang chủ | Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={CategoryData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProduct queryConfig={queryConfig} totalPage={productsData.data.data.total} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.items.map((product) => (
                  <div className='col-span-1' key={`p-${product.id}`}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} totalPage={productsData.data.data.total} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
