export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags: string[]
  sku: string
  weight: number
  availabilityStatus: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface NewProductForm {
  title: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
}

export type SortOrder = 'newest' | 'oldest'
export type SortField = 'createdAt' | 'price' | 'rating'

export interface Filters {
  search: string
  category: string
  brand: string
  minPrice: string
  maxPrice: string
  sortOrder: SortOrder
}

export interface AuthUser {
  username: string
  token: string
}
