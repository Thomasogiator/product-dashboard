import type { Product, ProductsResponse, NewProductForm } from '@/types'

const BASE = 'https://dummyjson.com'

export const PAGE_SIZE = 10

export async function fetchProducts(params: {
  page: number
  search?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
}): Promise<ProductsResponse> {
  const skip = (params.page - 1) * PAGE_SIZE

  let url: string

  if (params.search && params.search.trim()) {
    url = `${BASE}/products/search?q=${encodeURIComponent(params.search)}&limit=${PAGE_SIZE}&skip=${skip}`
  } else if (params.category && params.category !== 'all') {
    url = `${BASE}/products/category/${encodeURIComponent(params.category)}?limit=${PAGE_SIZE}&skip=${skip}`
  } else {
    url = `${BASE}/products?limit=${PAGE_SIZE}&skip=${skip}`
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  const data: ProductsResponse = await res.json()

  if (params.brand && params.brand !== 'all') {
    const filtered = data.products.filter(
      (p) => p.brand?.toLowerCase() === params.brand!.toLowerCase()
    )
    return { ...data, products: filtered, total: filtered.length }
  }

  if (params.minPrice || params.maxPrice) {
    const min = params.minPrice ? Number(params.minPrice) : 0
    const max = params.maxPrice ? Number(params.maxPrice) : Infinity
    const filtered = data.products.filter((p) => p.price >= min && p.price <= max)
    return { ...data, products: filtered, total: filtered.length }
  }

  return data
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`)
  if (!res.ok) throw new Error(`Product not found: ${res.status}`)
  return res.json()
}

export async function fetchCategories(): Promise<{ slug: string; name: string }[]> {
  const res = await fetch(`${BASE}/products/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products?limit=194&skip=0`)
  if (!res.ok) throw new Error('Failed to fetch all products')
  const data: ProductsResponse = await res.json()
  return data.products
}

export async function addProduct(product: NewProductForm): Promise<Product> {
  const res = await fetch(`${BASE}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to add product')
  return res.json()
}
