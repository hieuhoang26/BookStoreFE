import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'
import getData from 'src/apis/product.api'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import useQueryParams from 'src/hooks/useQueryParam'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
import ProductRating from 'src/components/ProductRating'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  const imageUrl = `http://localhost:8080/images/${product.imagePath[0]}`

  return (
    <Link to={`${path.home}${generateNameId({ name: product.title, id: product.id })}`}>
      {/* <Link to={`${path.home}${product.id}`}> */}
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={imageUrl}
            alt={product.title}
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[1rem] text-base line-clamp-2'>{product.title}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-sm'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={4} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.soldQuantity)}</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
