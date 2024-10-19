import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import FileUpload, { FileObject } from '../../components/FileUpload/FileUpload'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { productSchema, ProductSchema } from 'src/utils/rule'
import { useController, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import SelectInput from 'src/components/SelectInput'
import categoryApi from 'src/apis/category.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { FormErr } from './ModalCreate'

interface ModalEditProps {
  isOpenEdit: boolean
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>
  productId: number
}

export const coverTypeOptions = [
  { value: 'paperback', label: 'Paperback' },
  { value: 'hardcover', label: 'Hardcover' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'flap', label: 'French Flap' }
]

type FormEdit = ProductSchema

const ModalEdit: React.FC<ModalEditProps> = ({ isOpenEdit, setIsOpenEdit, productId }) => {
  const queryClient = useQueryClient()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [checkedCategories, setCheckedCategories] = useState([])
  const {
    register,
    control,
    setError,
    watch,
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<FormEdit>({
    defaultValues: {
      // id: 0,
      // shopId: 0,
      // shopName: '',
      title: '',
      price: 0,
      author: '',
      currentQuantity: 0,
      soldQuantity: 0,
      publisher: '',
      publicationDate: '',
      coverType: '',
      numberOfPages: 0,
      description: '',
      dimension: '',
      images: [] as string[]
    }
    // resolver: yupResolver(productSchema)
  })

  const { data: productDetailData } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductDetail(productId),
    enabled: isOpenEdit
  })
  const product = productDetailData?.data.data

  const { data: CategoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getAllCategory()
    },
    enabled: isOpenEdit
  })
  const categories = CategoryData?.data.data

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, formData }: { productId: number; formData: FormData }) =>
      productApi.updateProduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProductsForShop'] })
      handleClose()
    }
  })

  // const {
  //   field: { value: coverTypeValue, onChange: handleCoverTypeChange, ref }
  // } = useController({
  //   name: 'coverType',
  //   control,
  //   defaultValue: product?.coverType || ''
  // })

  useEffect(() => {
    if (product) {
      reset({
        // id: product.id,
        // shopId: product.shopId,
        // shopName: product.shopName || '',
        title: product.title || '',
        price: product.price || 0,
        author: product.author || '',
        currentQuantity: product.currentQuantity || 0,
        soldQuantity: product.soldQuantity || 0,
        publisher: product.publisher || '',
        publicationDate: product.publicationDate || '',
        coverType: product.coverType || '',
        numberOfPages: product.numberOfPages || 0,
        description: product.description || '',
        dimension: product.dimension || '',
        images: product.images || []
      })
    }
    if (product?.categories) {
      const categoryIds = categories
        .filter((category) => product.categories.includes(category.name))
        .map((category) => category.id)
      setCheckedCategories(categoryIds)
    }
    console.log('Vào Files:', uploadedFiles)
  }, [product, reset, product?.categories, categories, uploadedFiles])

  const handleFileChange = (files: File[]) => {
    // console.log('Uploaded Files:', files)
    setUploadedFiles(files)
  }

  const handleCheckboxChange = (categoryId) => {
    setCheckedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }
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
      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('images', file)
        })
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      const res = await updateProductMutation.mutateAsync({
        productId: productId,
        formData: formData
      })
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormErr>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormErr, {
              message: formError[key as keyof FormErr],
              type: 'Server'
            })
          })
        }
      } else {
        console.error('Error:', error)
      }
    }
  })

  const handleClose = () => {
    setIsOpenEdit(!isOpenEdit)
  }
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      {isOpenEdit && (
        <div
          id='default-modal'
          tabIndex={-1} // Allow keyboard focus
          // aria-hidden='true'
          className='fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 flex'
        >
          <div className='relative p-4 w-full max-w-5xl max-h-full'>
            <div className='relative bg-white rounded-lg shadow dark:bg-white-700 '>
              <div className='flex items-center justify-center p-10'>
                <span className='absolute top-4 left-4 font-bold text-2xl'>Edit book</span>
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
                <div className='mx-auto mt-5 w-full px-4 max-h-[80vh] overflow-y-auto overflow-hidden'>
                  <form onSubmit={onSubmitHandle}>
                    <div className='w-full'>
                      <div className='mb-5'>
                        <label htmlFor='title' className='mb-3 block text-base font-medium text-[#07074D]'>
                          Title
                        </label>
                        <input
                          type='text'
                          {...register('title')}
                          // value={formState.title}
                          // onChange={handleInputChange}
                          // name='title'
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
                            // value={formState.author}
                            // onChange={handleInputChange}
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
                            id='price'
                            placeholder='Price'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {errors.price && <p className='text-red-500'>{errors.price.message}</p>}
                        </div>
                      </div>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='discount' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Discount
                          </label>
                          <input
                            type='text'
                            // {...register('discount')}

                            id='discount'
                            placeholder='Discount (chưa update in db)'
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          />
                          {/* {errors.title && <p className='text-red-500'>{errors.title.message}</p>} */}
                        </div>
                      </div>
                    </div>

                    <div className='-mx-3 flex flex-wrap'>
                      <div className='w-full px-3 sm:w-1/2'>
                        <div className='mb-5'>
                          <label htmlFor='quanti' className='mb-3 block text-base font-medium text-[#07074D]'>
                            Quantity
                          </label>
                          <input
                            type='text'
                            {...register('currentQuantity')}
                            id='quanti'
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
                          <span>{product?.categories?.join(' - ')}</span>

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
                              <div key={`par-${category.id}`}>
                                <label className='inline-flex items-center px-4 py-2 text-sm text-gray-700'>
                                  <input
                                    type='checkbox'
                                    className='form-checkbox h-5 w-5 text-gray-600'
                                    id={category.id.toString()}
                                    // checked={product?.categories?.includes(category.name)}
                                    checked={checkedCategories.includes(category.id)}
                                    onChange={() => handleCheckboxChange(category.id)}
                                  />
                                  <span className='ml-2'>{category.name}</span>
                                </label>
                                {category.subcategories && (
                                  <div className='ml-4'>
                                    {category.subcategories.map((subcategory) => (
                                      <label
                                        key={`sub-${subcategory.id}`}
                                        className='inline-flex items-center px-4 py-2 text-sm text-gray-700'
                                      >
                                        <input
                                          type='checkbox'
                                          className='form-checkbox h-5 w-5 text-gray-600'
                                          id={subcategory.id}
                                          checked={checkedCategories.includes(subcategory.id)}
                                          onChange={() => handleCheckboxChange(subcategory.id)}
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
                          {errors.numberOfPages && <span>{errors.numberOfPages.message}</span>}
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
                    <FileUpload defaultFiles={product?.images || []} onFilesChange={handleFileChange} />
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

export default ModalEdit
