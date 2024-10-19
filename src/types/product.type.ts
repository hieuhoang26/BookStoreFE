export interface Product {
  id: number
  title: string
  price: number
  author: string
  currentQuantity: number
  soldQuantity: number
  imagePath: string[]
}

export interface ProductList {
  products: Product[]
  page: number
  size: number
  total: number
  // page: number
  // limit: number
  // page_size: number
}

export interface ProductListConfig {
  pageNo?: number | string
  pageSize?: number | string
  sortBy?: string
  category?: string
  // exclude?: string
  //   rating_filter?: number | string
  minPrice?: number | string
  maxPrice?: number | string
  name?: string
}
export interface DetailProduct {
  id: number
  shopId: number
  shopName: string
  title: string
  price: number
  author: string
  currentQuantity: number
  soldQuantity: number
  publisher: string
  publicationDate: string
  coverType: string
  numberOfPages: number
  description: string
  dimension: string
  categories: string[]
  images: string[]
}
