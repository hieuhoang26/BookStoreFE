import classNames from 'classnames'
import React from 'react'
import { sort } from 'src/constants/product'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'

interface Props {
  queryConfig: QueryConfig // get curr page
  totalPage: number
}

export default function SortProduct({ queryConfig, totalPage }: Props) {
  const page = Number(queryConfig.pageNo)
  const total = totalPage
  const { sortBy } = queryConfig // default value

  const navigate = useNavigate()

  //get value -> param
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sortBy'], undefined>) => {
    //remove undefined
    return sortBy === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sortBy'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sortBy: sortByValue
      }).toString()
      // can use omit to remove prop not need
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sort.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sort.createdAt)
            })}
            onClick={() => handleSort(sort.createdAt)}
          >
            Mới nhất
          </button>

          <button
            className={classNames('h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sort.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sort.sold)
            })}
            onClick={() => handleSort(sort.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'h-8  px-4 text-left text-sm capitalize  outline-none ',
              'bg-white text-black hover:bg-slate-100'
            )}
            value={sortBy || ''}
            onChange={(event) => handleSort(event.target.value as Exclude<ProductListConfig['sortBy'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option value={sort.priceAsc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={sort.priceDesc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>

        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{total}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    pageNo: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === total ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    pageNo: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
