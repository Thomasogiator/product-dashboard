import type { Filters } from '@/types'

export const queryKeys = {
  products: (page: number, filters: Partial<Filters>) =>
    ['products', page, filters] as const,
  product: (id: number) => ['product', id] as const,
  categories: () => ['categories'] as const,
  allProducts: () => ['allProducts'] as const,
}
