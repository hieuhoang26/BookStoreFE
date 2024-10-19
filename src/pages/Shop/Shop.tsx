import { useQuery } from '@tanstack/react-query'
import React from 'react'
import productApi from 'src/apis/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'

import Product from '../ProductList/components/Product'
import userImage from 'src/assets/images/user.svg'
import shopApi from 'src/apis/shop.api'
import { useParams } from 'react-router-dom'

export default function Shop() {
  //   const queryConfig = useQueryConfig()

  const { id } = useParams()

  //   const { data: productsData } = useQuery({
  //     queryKey: ['products', queryConfig],
  //     queryFn: () => {
  //       return productApi.getProducts(queryConfig as ProductListConfig)
  //     }
  //   })
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return shopApi.getProductsForShop(id)
    }
  })
  const { data: shopInf } = useQuery({
    queryKey: ['inf'],
    queryFn: () => {
      return shopApi.getShopInfo(id)
    }
  })

  const shop = shopInf?.data.data

  console.log('Pro inf', productsData)
  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>Trang chủ | Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-10 col-start-2 row-start-1'>
              <div className='container'>
                <div className=' p-4 shadow grid grid-cols-12 grid-rows-2'>
                  <div className='col-span-10 row-span-2 flex gap-4'>
                    <div className='pr-1 rounded-full '>
                      <img src={userImage} alt='shop' className='rounded-full block h-20 left-0 top-0'></img>
                    </div>
                    <div className='flex flex-col grow justify-between overflow-hidden text-left gap-1'>
                      <div className='text-black text-xl font-medium'>{shop?.shopName}</div>
                      <div className='text-black text-sm font-medium'>{shop?.contactPhone}</div>
                      <div className='text-black text-sm font-medium'>{shop?.contactEmail}</div>
                      <div className='text-black text-sm font-medium'>{shop?.shopAddress}</div>
                      <div className=' flex mt-2 gap-1'></div>
                    </div>
                  </div>
                  <div className='col-span-2 col-start-11'>
                    <button className='flex gap-1 h-10 items-center justify-center rounded-sm border border-orange bg-orange/10 px-3 capitalize text-orange shadow-sm hover:bg-orange/5 w-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'
                        />
                      </svg>
                      <span>Chat ngay</span>
                    </button>
                  </div>
                  <div className='mt-1 col-span-2 col-start-11 row-start-2'>
                    <button className='flex gap-1 h-10 items-center justify-center rounded-sm border border-orange bg-orange/10 px-3 capitalize text-orange shadow-sm hover:bg-orange/5 w-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z'
                        />
                      </svg>
                      <span>Theo dõi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-span-10 row-span-3 col-start-2'>
              {/* <SortProduct queryConfig={queryConfig} totalPage={productsData.data.data.total} /> */}
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.map((product) => (
                  <div className='col-span-1' key={product.id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* <Pagination queryConfig={queryConfig} totalPage={productsData.data.data.total} /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
