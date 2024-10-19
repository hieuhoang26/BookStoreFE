import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import FileUpload, { FileObject } from '../../components/FileUpload/FileUpload'
import { productSchema, ProductSchema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { coverTypeOptions } from './ModalEdit'
import categoryApi from 'src/apis/category.api'

interface ModalCreateProps {
  isOpenCreate: boolean
  setIsOpenCreate: Dispatch<SetStateAction<boolean>>
  toggleModal: () => void
}
export type Form = ProductSchema
export type FormErr = ProductSchema

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpenCreate, setIsOpenCreate }) => {
  const queryClient = useQueryClient()

  const { profile } = useContext(AppContext)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [checkedCategories, setCheckedCategories] = useState([])

  const {
    register,
    setError,
    reset,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    // resolver: yupResolver(productSchema)
  })
  useEffect(() => {
    console.log('Vào Files:', uploadedFiles)
  }, [uploadedFiles])

  const createProductMutation = useMutation({
    mutationFn: ({ shopId, formData }: { shopId: number; formData: FormData }) =>
      productApi.createProduct(shopId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProductsForShop'] })
      handleClose()
    }
  })
  const { data: CategoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getAllCategory()
    }
  })

  const categories = CategoryData?.data.data
  const onSubmitHandle = handleSubmit(async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title || '')
      formData.append('price', data.price.toString())
      formData.append('author', data.author || '')
      formData.append('currentQuantity', data.currentQuantity.toString())
      formData.append('soldQuantity', data.soldQuantity.toString())
      formData.append('publisher', data.publisher || '')
      formData.append('publicationDate', data.publicationDate || '')
      formData.append('coverType', data.coverType || '')
      formData.append('numberOfPages', data.numberOfPages.toString())
      formData.append('description', data.description || '')
      formData.append('dimension', data.dimension || '')

      if (checkedCategories.length > 0) {
        checkedCategories.forEach((categoryId) => {
          formData.append('category', categoryId)
        })
      }
      // if (uploadedFiles && Object.keys(uploadedFiles).length > 0) {
      //   Object.keys(uploadedFiles).forEach((fileName) => {
      //     const file = uploadedFiles[fileName]
      //     formData.append('images', file)
      //   })
      // }
      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('images', file)
        })
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      const res = await createProductMutation.mutateAsync({
        shopId: profile?.shopId,
        formData: formData
      })
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormErr>>(error)) {
        const formError = error.response?.data.data
        console.log('Server Validation Error:', error)

        // Nếu có lỗi từ server, setError cho từng trường tương ứng
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormErr, {
              message: formError[key as keyof FormErr],
              type: 'Server'
            })
          })
        }
      } else {
        // Thông báo lỗi khác nếu không phải lỗi 422
        console.error('Error:', error)
        // toast.error('Something went wrong. Please try again.')
      }
    }
  })

  const handleFileChange = (files: File[]) => {
    console.log('Uploaded Files:', files)
    setUploadedFiles(files)
  }

  const handleClose = () => {
    setIsOpenCreate(!isOpenCreate)
  }
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  const handleCheckboxChange = (categoryId) => {
    setCheckedCategories((prev) => [...prev, categoryId])
  }

  return (
    <>
      {isOpenCreate && (
        <div
          id='default-modal'
          tabIndex={-1}
          aria-hidden='true'
          className='fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 flex'
        >
          <div className='relative p-4 w-full max-w-5xl max-h-full'>
            <div className='relative bg-white rounded-lg shadow dark:bg-white-700 '>
              <div className='flex items-center justify-center p-10'>
                <button className='absolute top-4 right-4' onClick={handleClose}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                  </svg>
                </button>
                <div className='mx-auto w-full px-4 max-h-[80vh] overflow-y-auto overflow-hidden'>
                  {/* max-w-[550px] */}
                  <form onSubmit={onSubmitHandle}>
                    <div className='w-full'>
                      <div className='mb-5'>
                        <label htmlFor='title' className='mb-3 block text-base font-medium text-[#07074D]'>
                          Title
                        </label>
                        <input
                          type='text'
                          {...register('title')}
                          // name='fName'
                          id='title'
                          placeholder='Name of Book'
                          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                        />
                        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
                      </div>
                    </div>
                    <div className='-mx-3 flex flex-wrap'>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='author' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Author
                          </label>
                          <input
                            type='text'
                            {...register('author')}
                            // name='author'
                            id='author'
                            placeholder='Author'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.author && <p className='text-red-500'>{errors.author.message}</p>}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='publisher' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Publisher
                          </label>
                          <input
                            type='text'
                            {...register('publisher')}
                            // name='publisher'
                            id='publisher'
                            placeholder='Publisher'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.publisher && <p className='text-red-500'>{errors.publisher.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className='-mx-3 flex flex-wrap'>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='price' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Price
                          </label>
                          <input
                            type='text'
                            {...register('price')}
                            // name='price'
                            id='price'
                            placeholder='Price'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                        </div>
                        {errors.price && <p className='text-red-500'>{errors.price.message}</p>}
                      </div>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='discount' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Discount
                          </label>
                          <input
                            type='text'
                            // {...register('discount')}
                            name='discount'
                            id='discount'
                            placeholder='Discount'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                        </div>
                        {/* {errors.title && <p className='text-red-500'>{errors.title.message}</p>} */}
                      </div>
                    </div>

                    <div className='-mx-3 flex flex-wrap'>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='currentQuantity' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Quantity
                          </label>
                          <input
                            type='text'
                            {...register('currentQuantity')}
                            // name='currentQuantity'
                            id='currentQuantity'
                            placeholder='Quantity'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.currentQuantity && <p className='text-red-500'>{errors.currentQuantity.message}</p>}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='sold' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Sold
                          </label>
                          <input
                            type='text'
                            {...register('soldQuantity')}
                            // name='sold'
                            id='sold'
                            placeholder='Sold'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.soldQuantity && <p className='text-red-500'>{errors.soldQuantity.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className='mb-5'>
                      <label htmlFor='category' className='mb-3 block text-base font-medium text-[#07074D]'>
                        Category
                      </label>
                      <div>
                        <button
                          type='button'
                          className='inline-flex w-full h-full justify-between items-center rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          id='filter-button'
                          aria-expanded={isDropdownOpen ? 'true' : 'false'}
                          aria-haspopup='true'
                          onClick={handleToggleDropdown}
                        >
                          <svg
                            className='ml-auto -mr-1 h-5 w-5 text-gray-400 right-0'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                          >
                            <path
                              fillRule='evenodd'
                              d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </button>
                      </div>
                      {isDropdownOpen && (
                        <div
                          className='right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                          role='menu'
                          aria-orientation='vertical'
                          aria-labelledby='filter-button'
                        >
                          <div className='py-1 flex flex-col' role='none'>
                            {categories.map((category) => (
                              <div key={category.id}>
                                <label className='inline-flex items-center px-4 py-2 text-sm text-gray-700'>
                                  <input
                                    type='checkbox'
                                    className='form-checkbox h-5 w-5 text-gray-600'
                                    onChange={() => handleCheckboxChange(category.id)}
                                    id={`filter-option-${category.id}`}
                                  />
                                  <span className='ml-2'>{category.name}</span>
                                </label>
                                {category.subcategories && (
                                  <div className='ml-4'>
                                    {category.subcategories.map((subcategory) => (
                                      <label
                                        key={subcategory.id}
                                        className='inline-flex items-center px-4 py-2 text-sm text-gray-700'
                                      >
                                        <input
                                          type='checkbox'
                                          className='form-checkbox h-5 w-5 text-gray-600'
                                          onChange={() => handleCheckboxChange(subcategory.id)}
                                          id={`filter-option-${subcategory.id}`}
                                        />
                                        <span className='ml-2'>{subcategory.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* {errors.title && <p className='text-red-500'>{errors.title.message}</p>} */}
                    </div>

                    <div className='-mx-3 flex flex-wrap'>
                      <div className='w-full px-3 sm:w-1/4'>
                        <div className='mb-5'>
                          <label htmlFor='date' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Date
                          </label>
                          <input
                            type='date'
                            {...register('publicationDate')}
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.publicationDate && <p className='text-red-500'>{errors.publicationDate.message}</p>}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/4'>
                        <div className='mb-5'>
                          <label htmlFor='cover' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Cover Type
                          </label>
                          <select
                            id='coverType'
                            className='w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#0e0f11] outline-none focus:border-[#6A64F1] focus:shadow-md'
                            {...register('coverType')}
                            // value={coverTypeValue}
                            // onChange={handleCoverTypeChange}
                            // ref={ref}
                          >
                            {coverTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.coverType && <span>{errors.coverType.message}</span>}

                          {/* {errors.title && <p className='text-red-500'>{errors.title.message}</p>} */}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/4'>
                        <div className='mb-5'>
                          <label htmlFor='page' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Number Pages
                          </label>
                          <input
                            type='text'
                            {...register('numberOfPages')}
                            id='page'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.numberOfPages && <p className='text-red-500'>{errors.numberOfPages.message}</p>}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/4'>
                        <div className='mb-5'>
                          <label htmlFor='dimension' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Dimension
                          </label>
                          <input
                            type='text'
                            {...register('dimension')}
                            id='dimension'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.dimension && <p className='text-red-500'>{errors.dimension.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className='mb-5'>
                      <label htmlFor='description' className='mb-3 block text-base font-medium text-[#07074D]'>
                        Description
                      </label>
                      <input
                        type='text'
                        {...register('description')}
                        id='Description'
                        placeholder='Description'
                        className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                      />
                      {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                    </div>
                    <FileUpload defaultFiles={[]} onFilesChange={handleFileChange} />
                    <div>
                      <button
                        type='submit'
                        className='hover:shadow-form m-2 rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none'
                      >
                        Submit
                      </button>
                      <button
                        onClick={handleClose}
                        type='button'
                        className='hover:shadow-form rounded-md bg-[#b2b2b8] py-3 px-8 text-center text-base font-semibold text-white outline-none'
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ModalCreate
