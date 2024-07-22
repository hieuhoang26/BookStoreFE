import React from 'react'
import Product from './Product/Product'
import SortProduct from './SortProduct'
import AsideFilter from './AsideFilter'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import useQueryParams from 'src/hooks/useQueryParam'

export default function ProductList() {
  const queryParams = useQueryParams()
  const { data: productsData } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryParams)
    }
    // keepPreviousData: true,
    // staleTime: 3 * 60 * 1000
  })

  console.log(productsData)
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
              {/* <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} /> */}
              <AsideFilter />
            </div>
            <div className='col-span-9'>
              {/* <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
              <SortProduct />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.items.map((product) => (
                  <div className='col-span-1' key={product.id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
