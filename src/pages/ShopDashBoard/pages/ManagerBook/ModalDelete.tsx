import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'

interface ModalDelProps {
  isOpenDel: boolean
  setIsOpenDel: Dispatch<SetStateAction<boolean>>
  productId: number
  // toggleModalDelete: (n: number) => void
}
const ModalDelete: React.FC<ModalDelProps> = ({ isOpenDel, setIsOpenDel, productId }) => {
  const queryClient = useQueryClient()
  const toggleModal = () => {
    setIsOpenDel(!isOpenDel)
  }

  const deleteProductMutation = useMutation({
    mutationFn: (bookId: number) => {
      return productApi.deleteProduct(bookId)
    },
    onSuccess: () => {
      toast.success('Delete success')
    }
  })
  const handleDelete = () => {
    deleteProductMutation.mutate(productId)
    queryClient.invalidateQueries({ queryKey: ['getProductsForShop'] })
    toggleModal()
  }
  return (
    <>
      {isOpenDel && (
        <div
          id='default-modal'
          tabIndex={-1}
          aria-hidden='true'
          className='fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 flex'
        >
          <div className='relative p-4 w-full max-w-2xl max-h-full'>
            <div className='relative bg-gray-200 rounded-lg shadow'>
              <div className='flex items-center justify-between p-4 md:p-5  rounded-t shadow '>
                <h3 className='text-xl font-semibold '>Lưu ý</h3>
                <button
                  type='button'
                  onClick={toggleModal}
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                >
                  <svg
                    className='w-3 h-3'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 14 14'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              <div className='p-4 md:p-5 space-y-4 shadow'>
                <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>Bạn có muốn xoá ?</p>
              </div>
              <div className='flex items-center p-4 md:p-5 border-gray-200 rounded-b dark:border-gray-600'>
                <button
                  onClick={handleDelete}
                  type='button'
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  I accept
                </button>
                <button
                  onClick={toggleModal}
                  type='button'
                  className='py-2.5 px-5 ms-3 text-sm font-medium  focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 '
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ModalDelete
