export interface CartResponse {
  userId: number
  cartId: number
  itemList: itemList[]
}
export interface itemList {
  bookId: number
  shopId: number
  title: string
  price: number
  currentQuantity: number
  imagePath: string
  quantity: number
}
