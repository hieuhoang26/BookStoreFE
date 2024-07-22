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
  pagination: {
    page: number
    size: number
    total: number
    // page: number
    // limit: number
    // page_size: number
  }
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  //   rating_filter?: number | string
  //   price_max?: number | string
  //   price_min?: number | string
  name?: string
  category?: string
}
export interface ImageList {
  imgPath: string
}
