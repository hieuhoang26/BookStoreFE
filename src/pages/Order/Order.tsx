import { useMutation, useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { formatCurrency, OrderStatus } from 'src/utils/utils'

interface ModalOrderProps {
  isOrderOpen: boolean
  setOrderOpen: React.Dispatch<React.SetStateAction<boolean>>
  purchasesInCart: any[]
  total: number
}
export const Order: React.FC<ModalOrderProps> = ({ isOrderOpen, setOrderOpen, purchasesInCart, total }) => {
  const { profile } = useContext(AppContext)

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(profile?.id)
  })
  const userInfo = profileData?.data.data

  const [name, setName] = useState(userInfo?.username || '')
  const [phone, setPhone] = useState(userInfo?.phoneNumber || '')
  const [address, setAddress] = useState('')
  console.log(purchasesInCart)
  const toggleModal = () => {
    setOrderOpen(!isOrderOpen)
  }
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      // refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const handleBuyPurchases = () => {
    if (purchasesInCart.length > 0) {
      const body = {
        userId: profile?.id,
        totalPrice: total,
        address: address,
        statusOrder: OrderStatus.Processing, // Use the enum
        orderItems: purchasesInCart.map((purchase) => ({
          bookId: purchase.bookId,
          shopId: purchase.shopId,
          quantity: purchase.quantity
        }))
      }
      buyProductsMutation.mutate(body)
    }
  }
  return (
    <>
      {isOrderOpen && (
        <div
          id='default-modal'
          tabIndex={-1}
          // aria-hidden='true'
          className='fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 flex'
        >
          <div className='relative p-4 w-full max-w-4xl max-h-full'>
            <div className='relative bg-white rounded-lg shadow max-h-[90vh] overflow-y-auto '>
              <div className=' flex items-center justify-between p-4 md:p-5 rounded-t shadow '>
                <h3 className='text-2xl font-semibold '>Thanh Toán</h3>
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
                </button>
              </div>

              {/* Info */}
              <div className='shadow  pb-1'>
                <div className=' flex gap-2 p-4 md:p-5 items-center '>
                  <svg height='16' viewBox='0 0 12 16' width='12' className='shopee-svg-icon icon-location-marker '>
                    <path
                      d='M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z'
                      fillRule='evenodd'
                      fill='red'
                    ></path>
                  </svg>
                  <p className='text-base text-red-500 '>Địa chỉ nhận hàng</p>
                </div>
                <div className='mx-4'>
                  <div className='-mx-3 flex flex-wrap'>
                    <div className='w-full px-3 sm:w-1/2'>
                      <div className='mb-3'>
                        <input
                          type='text'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          id='name'
                          placeholder='Name'
                          className='w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                        />
                      </div>
                    </div>
                    <div className='w-full px-3 sm:w-1/2'>
                      <div className='mb-5'>
                        <input
                          type='text'
                          // name='publisher'
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          id='phone'
                          placeholder='Phone'
                          className='w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-5'>
                      <input
                        type='text'
                        // name='fName'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        id='title'
                        placeholder='Address'
                        className='w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='m-3'>
                <table className='mt-3 text-xs text-left rtl:text-right w-full'>
                  <thead className=' '>
                    <tr>
                      <th scope='col' className='px-6 py-3 w-1/2'>
                        Product
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Price
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Quantity
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasesInCart.map((item) => (
                      <tr key={item.bookId}>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark'
                        >
                          <div className='flex items-center'>
                            <img
                              src={
                                `http://localhost:8080/images/${item.imagePath}` ||
                                `http://localhost:8080/images/${item.images[0]}`
                              }
                              alt={item.title}
                              className='w-16 h-16 object-cover rounded'
                            />
                            <span className='ml-2'>{item.title}</span>
                          </div>
                        </th>
                        <td className='px-6 py-4'>${item.price}</td>
                        <td className='px-6 py-4'>{item.quantity}</td>
                        <td className='px-6 py-4'>${(item.price * item.quantity).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className='p-5 bg-white rounded-md'>
                  <div className='flex justify-between items-center pb-4 '>
                    <span className='font-medium text-lg'>Phương thức thanh toán</span>
                    <span className='text-blue-500 cursor-pointer'>THAY ĐỔI</span>
                  </div>
                  <div className='py-2 space-y-3 text-sm text-gray-600'>
                    <div className='flex justify-between'>
                      <span>Tổng tiền hàng</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Phí vận chuyển</span>
                      <span>₫18.300</span>
                    </div>
                    <div className='flex justify-between font-bold text-red-600 text-lg'>
                      <span>Tổng thanh toán</span>
                      <span>₫94.300</span>
                    </div>
                  </div>

                  <div className='pt-3'>
                    <p className='text-xs text-gray-500 pb-4'>
                      Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản
                    </p>
                    <button
                      onClick={handleBuyPurchases}
                      className='w-full bg-red-500 text-white py-3 rounded-md text-lg'
                    >
                      Đặt hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
