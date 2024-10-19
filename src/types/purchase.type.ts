import { Product } from './product.type'

export interface Purchase {
  bookId: number
  title: string
  price: number
  currentQuantity: number
  imagePath: string
  quantity: number
}

export interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}
// id: string
// buy_count: number
// price: number
// price_before_discount: number
// status: PurchaseStatus
// user: string
// product: Product
// createdAt: string
// updatedAt: string

export interface OrderResponse {
  id: number
  name: string
  phone: string
  shoppingAddress: string
  totalPrice: number
  orderStatus: string
  Purchase: []
}
