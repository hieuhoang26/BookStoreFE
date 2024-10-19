import classNames from 'classnames'
import React from 'react'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

interface Props {
  queryConfig: QueryConfig // get curr page
  // page: number
  // setPage: React.Dispatch<React.SetStateAction<number>>
  totalPage: number
}

const RANGE = 2
export default function Pagination({ queryConfig, totalPage }: Props) {
  const page = Number(queryConfig.pageNo) // curr page
  const total = totalPage

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(total)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // console.log(`pageNumber: ${pageNumber} index: ${index} page: ${page}`)
        // Điều kiện để return về ...
        // if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < total - RANGE + 1) {
        //   return renderDotAfter(index)
        // } else if (page > RANGE * 2 + 1 && page < total - RANGE * 2) {
        //   if (pageNumber < page - RANGE && pageNumber > RANGE) {
        //     return renderDotBefore(index)
        //   } else if (pageNumber > page + RANGE && pageNumber < total - RANGE + 1) {
        //     return renderDotAfter(index)
        //   }
        // } else if (page >= total - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        //   return renderDotBefore(index)
        // }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                pageNo: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              pageNo: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Prev
        </Link>
      )}
      {renderPagination()}
      {page === total ? (
        <span className='mx-2 cursor-not-allowed  rounded border bg-white/60 px-3 py-2  shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              pageNo: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
