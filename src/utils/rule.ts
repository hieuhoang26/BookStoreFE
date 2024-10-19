/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
// valid default of react hook form
type Rules = { [key in 'username' | 'email' | 'password' | 'confirm_password' | 'phoneNumber']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  username: {
    required: {
      value: true,
      message: 'UserName là bắt buộc'
    }
  },
  phoneNumber: {
    required: {
      value: true,
      message: 'UserName là bắt buộc'
    }
  },
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Nhập lại password không khớp'
        : undefined
  }
})

// valid use yup
const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
  username: yup.string().trim().required('Tên sản phẩm là bắt buộc'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  phoneNumber: yup.string().required('Số điện thoại là bắt buộc'),
  // .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa các chữ số')
  // .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
  // .max(11, 'Số điện thoại không được quá 11 chữ số')

  minPrice: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  maxPrice: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  })
})
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { maxPrice, minPrice } = this.parent as { minPrice: string; maxPrice: string }
  if (minPrice !== '' && maxPrice !== '') {
    return Number(maxPrice) >= Number(minPrice)
  }
  return minPrice !== '' || maxPrice !== ''
}
// render interface from schema by yup
export type Schema = yup.InferType<typeof schema>

// get interface from exist schema
export const loginSchema = schema.omit(['confirm_password', 'email', 'phoneNumber', 'minPrice', 'maxPrice'])

export type LoginSchema = yup.InferType<typeof loginSchema>

export const userSchema = yup.object({
  username: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phoneNumber: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  // address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  dateOfBirth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})
export type UserSchema = yup.InferType<typeof userSchema>

export const productSchema = yup.object().shape({
  // id: yup.number().required('ID is required').positive('ID must be positive').integer('ID must be an integer'),
  // id: yup.number(),
  // shopId: yup.number(),
  title: yup.string().required('Title is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  author: yup.string().required('Author is required'),
  currentQuantity: yup.number().required('Current Quantity is required').min(0, 'Quantity cannot be negative'),
  soldQuantity: yup.number().required('Sold Quantity is required').min(0, 'Quantity cannot be negative'),
  publisher: yup.string().required('Publisher is required'),
  publicationDate: yup.string().required('Publication Date is required'),
  coverType: yup.string().required('Cover Type is required'),
  numberOfPages: yup.number().required('Number of Pages is required').min(1, 'Must have at least 1 page'),
  description: yup.string().required('Description is required'),
  dimension: yup.string().required('Dimension is required'),
  // images: yup.array().of(yup.string().required()).min(1, 'At least one image is required')
  images: yup.array().of(yup.string())
})

export type ProductSchema = yup.InferType<typeof productSchema>
