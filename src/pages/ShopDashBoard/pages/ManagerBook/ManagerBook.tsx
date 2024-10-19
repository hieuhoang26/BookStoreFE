/* eslint-disable react/no-unknown-property */
import React, { useContext, useState } from 'react'
import ModalCreate from './ModalCreate'
import { useParams } from 'react-router-dom'
import shopApi from 'src/apis/shop.api'
import { useQuery } from '@tanstack/react-query'
import ModalEdit from './ModalEdit'
import ModalDelete from './ModalDelete'
import { AppContext } from 'src/contexts/app.context'

export default function ManagerBook() {
  const { profile } = useContext(AppContext)
  const [isOpenCreate, setIsOpenCreate] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)

  // const { id } = useParams()
  const id = profile?.shopId
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  const { data: productsData } = useQuery({
    queryKey: ['getProductsForShop'],
    queryFn: () => {
      return shopApi.getProductsForShop(id)
    }
  })
  const list = productsData?.data.data ?? []

  const toggleModalCreate = () => {
    setIsOpenCreate(!isOpenCreate)
  }
  const toggleModalEdit = (productId: number) => {
    setSelectedProductId(productId)
    setIsOpenEdit(!isOpenEdit)
  }
  const toggleModalDelete = (productId: number) => {
    setSelectedProductId(productId)
    setIsOpenDel(!isOpenDel)
  }

  return (
    <>
      <div className='rounded-sm bg-white p-6 shadow md:px-7 md:pb-20'>
        <button
          onClick={toggleModalCreate}
          type='button'
          className='rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-base text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 flex items-center'
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='size-5 mr-2'>
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z'
              clipRule='evenodd'
            />
          </svg>
          Add new book
        </button>
        <div className='mt-4'>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left rtl:text-right '>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-white'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Product name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    <div className='flex items-center'>
                      Price
                      <svg
                        className='w-3 h-3 ms-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                      </svg>
                    </div>
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    <div className='flex items-center'>
                      Author
                      <svg
                        className='w-3 h-3 ms-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                      </svg>
                    </div>
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    <div className='flex items-center'>
                      Quantity
                      <svg
                        className='w-3 h-3 ms-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                      </svg>
                    </div>
                  </th>
                  <th scope='col' className='px-6 py-3 text-center'>
                    <span className=''>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((product: Product) => (
                  <tr key={product.id} className='bg-white border-b'>
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark'>
                      {product.title}
                    </th>
                    <td className='px-6 py-4'>${product.price}</td>
                    <td className='px-6 py-4'>{product.author}</td>
                    <td className='px-6 py-4'>{product.currentQuantity}</td>
                    <td className='px-6 py-4 text-right'>
                      <button
                        onClick={() => toggleModalEdit(product.id)}
                        className='rounded-md bg-gray-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-gray-700 focus:shadow-none active:bg-gray-700 hover:bg-gray-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'
                        type='button'
                      >
                        Update
                      </button>
                      <button
                        onClick={() => toggleModalDelete(product.id)}
                        className='rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'
                        type='button'
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ModalCreate isOpenCreate={isOpenCreate} setIsOpenCreate={setIsOpenCreate} toggleModal={toggleModalCreate} />
        <ModalEdit
          isOpenEdit={isOpenEdit}
          setIsOpenEdit={setIsOpenEdit}
          productId={selectedProductId}
          // toggleModalEdit={toggleModalEdit}
        />
        <ModalDelete
          isOpenDel={isOpenDel}
          setIsOpenDel={setIsOpenDel}
          productId={selectedProductId}
          // toggleModalDelete={toggleModalDelete}
        />
      </div>
    </>
  )
}
