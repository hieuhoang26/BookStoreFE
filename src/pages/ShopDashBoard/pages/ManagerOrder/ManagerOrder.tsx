import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import { AppContext } from 'src/contexts/app.context'
import { convertToOrderStatus, OrderStatus, OrderStatusOptions } from 'src/utils/utils'

export default function ManagerOrder() {
  const { profile } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: res, refetch } = useQuery({
    queryKey: ['getPurchasesForShop'],
    queryFn: () => purchaseApi.getPurchasesForShop(profile?.shopId)
  })
  const orderData = res?.data.data

  const changeStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: number }) => purchaseApi.changeStatus(orderId, status),
    onSuccess: () => {
      refetch()
    }
  })
  const deleteProductMutation = useMutation({
    mutationFn: (orderId: number) => {
      return purchaseApi.deletePurchase(orderId)
    },
    onSuccess: () => {
      toast.success('Delete success')
    }
  })

  const handleChangeStatus = (orderId: number, status: number) => {
    changeStatus.mutate({ orderId, status })
  }
  const handleDelete = (orderId: number) => {
    deleteProductMutation.mutate(orderId)
    queryClient.invalidateQueries({ queryKey: ['getPurchasesForShop'] })
  }

  return (
    <>
      <div className='rounded bg-white p-6 shadow md:px-7 md:pb-20 border-'>
        {orderData?.map((order) => (
          <div
            key={order.id}
            className='grid grid-cols-4 grid-rows-1 gap-4 p-4 border border-gray-300 rounded-lg shadow'
          >
            <div className='col-span-2'>
              <h2 className='text-xl font-semibold'>{order.name}</h2>
              <p className='text-gray-700'>${order.totalPrice}</p>
              <ul className='space-y-2'>
                {order.orderItems.map((item) => (
                  <li key={item.id} className='flex items-center mx-5 mt-7'>
                    <div className='flex items-center'>
                      <img
                        src={`http://localhost:8080/images/${item.image}`}
                        alt={item.bookTitle}
                        className='w-16 h-16 object-cover rounded-md mr-4'
                      />
                      <p className='font-medium'>{item.bookTitle}</p>

                      <p className='text-sm text-gray-500 ml-20'>SL: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='col-start-3 flex flex-col justify-center space-y-2'>
              <select
                name='status'
                id='status'
                className='border py-2 px-4'
                value={order.orderStatus}
                onChange={(e) => handleChangeStatus(order.id, convertToOrderStatus(e.target.value))}
              >
                {OrderStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-start-4 flex flex-col justify-center space-y-2'>
              <button className='bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600'>
                Edit Order
              </button>
              <button
                onClick={() => handleDelete(order.id)}
                className='bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600'
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
