import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import cartApi from 'src/apis/cart.api'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { AppContext } from 'src/contexts/app.context'
import { DetailProduct } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import path from 'src/constants/path'
import { Order } from '../Order/Order'

export default function ProductDetail() {
  const { t } = useTranslation(['product'])

  const { profile } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const [activeImage, setActiveImage] = useState('')
  const [isOrderOpen, setOrderOpen] = useState(false)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 1])
  const [buyCount, setBuyCount] = useState(1)

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart
  })
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data
  const toOrder = {
    bookId: product?.id,
    title: product?.title,
    imagePath: product?.images[0],
    price: product?.price,
    shopId: product?.shopId,
    quantity: buyCount
  }
  const imageUrl = `http://localhost:8080/images/${product?.images[0]}`

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  useEffect(() => {
    if (product && product.images.length > 0) {
      // setActiveImage(product.imagePath[0])
      setActiveImage(imageUrl)
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImage(`http://localhost:8080/images/${img}`)
  }
  const next = () => {
    if (currentIndexImages[1] < (product as DetailProduct).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  // const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   const rect = event.currentTarget.getBoundingClientRect()
  //   const image = imageRef.current as HTMLImageElement
  //   const { naturalHeight, naturalWidth } = image
  //   // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
  //   // const { offsetX, offsetY } = event.nativeEvent

  //   // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
  //   const offsetX = event.pageX - (rect.x + window.scrollX)
  //   const offsetY = event.pageY - (rect.y + window.scrollY)

  //   const top = offsetY * (1 - naturalHeight / rect.height)
  //   const left = offsetX * (1 - naturalWidth / rect.width)
  //   image.style.width = naturalWidth + 'px'
  //   image.style.height = naturalHeight + 'px'
  //   image.style.maxWidth = 'unset'
  //   image.style.top = top + 'px'
  //   image.style.left = left + 'px'
  // }

  // const handleRemoveZoom = () => {
  //   imageRef.current?.removeAttribute('style')
  // }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { userId: profile?.id, bookId: product?.id, quantity: buyCount },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      }
    )
  }
  const handleOpenOrder = () => {
    setOrderOpen(!isOrderOpen)
  }

  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 150
            }
          })}
        />
      </Helmet> */}
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9 mt-4'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                // onMouseMove={handleZoom}
                // onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product?.title}
                  className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                  //   ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = `http://localhost:8080/images/${img}` === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        // src={img}
                        src={`http://localhost:8080/images/${img}`}
                        alt={product?.title}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase text-left'>{product?.title}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{4}</span>
                  <ProductRating
                    // rating={product.rating}
                    rating={4}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(Number(product?.soldQuantity))}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(Number(product?.price))}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(Number(product?.price))}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {/* {rateSale(product.price_before_discount, product.price)} giảm */}
                  {50} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product?.currentQuantity}
                />
                <div className='ml-6 text-sm text-gray-500'>
                  {product?.currentQuantity} {t('product:available')}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleOpenOrder}
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-5'>
        <div className='container'>
          <div className='bg-white p-4 shadow'>
            <div className='flex items-center justify-start overflow-visible '>
              <div className='pr-1 rounded-full '>
                <img src={activeImage} alt='shop' className='rounded-full block h-20 left-0 top-0'></img>
              </div>
              <div className='flex flex-col grow justify-between overflow-hidden text-left'>
                <div className='text-black text-xl font-medium'>TenShooppppp</div>
                <div className='text-black text-sm font-medium'>Online 10p truowcs</div>
                <div className=' flex mt-2 gap-1'>
                  <button className='flex gap-1 h-10 items-center justify-center rounded-sm border border-orange bg-orange/10 px-3 capitalize text-orange shadow-sm hover:bg-orange/5'>
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
                  <Link
                    // to={`${path.shop}/${String(product?.shopId)}`}
                    to={path.shop.replace(':id', String(product?.shopId))}
                    className='flex gap-1 h-10 items-center justify-center rounded-sm border border-orange bg-orange/10 px-3 capitalize text-orange shadow-sm hover:bg-orange/5'
                  >
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
                    <span>Xem Shop</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container  text-left'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mt-4 mb-4 text-sm leading-loose'>
              <div className='flex mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Author : </span>
                <span>{product?.author}</span>
              </div>
              <div className='flex gap-2 mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Publisher : </span>
                <span>{product?.publisher}</span>
              </div>
              <div className='flex gap-2 mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Publication Date : </span>
                <span>{product?.publicationDate}</span>
              </div>
              <div className='flex gap-2 mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Dimension : </span>
                <span>{product?.dimension}</span>
              </div>
              <div className='flex gap-2 mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Cover Type : </span>
                <span>{product?.coverType}</span>
              </div>
              <div className='flex gap-2 mb-3'>
                <span className='box-border text-neutral-300 pr-5'>Number of Pages : </span>
                <span>{product?.numberOfPages}</span>
              </div>

              <span> {product?.description}</span>

              {/* <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {/* {productsData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
      <Order
        isOrderOpen={isOrderOpen}
        setOrderOpen={setOrderOpen}
        purchasesInCart={[toOrder]}
        total={product?.price * buyCount}
      />
    </div>
  )
}
