import axios, { AxiosError } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import userImage from 'src/assets/images/user.svg'
import config from 'src/constants/config'
import { ErrorResponse } from 'src/types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}
export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}images/${avatarName}` : userImage)

// format for price product
//https://dev.to/saranshk/how-to-format-a-number-as-currency-in-javascript-587b
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}
export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

// genarate url from name product
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string | number }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

// export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}images/${avatarName}` : userImage)
export enum OrderStatus {
  Processing = 1,
  Shipping = 2,
  Successful = 3,
  Return = 4,
  Canceled = 5
}
export const convertToOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case 'Processing':
      return OrderStatus.Processing
    case 'Shipping':
      return OrderStatus.Shipping
    case 'Successful':
      return OrderStatus.Successful
    case 'Return':
      return OrderStatus.Return
    case 'Canceled':
      return OrderStatus.Canceled
    default:
      throw new Error('Invalid status value')
  }
}
export const OrderStatusOptions = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipping', label: 'Shipping' },
  { value: 'Successful', label: 'Successful' },
  { value: 'Return', label: 'Return' },
  { value: 'Canceled', label: 'Canceled' }
]
