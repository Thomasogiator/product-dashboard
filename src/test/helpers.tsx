import { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../lib/AuthContext'
import { FiltersProvider } from '../lib/FiltersContext'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: ReactNode,
  {
    initialPath = '/',
    queryClient = makeQueryClient(),
  }: { initialPath?: string; queryClient?: QueryClient } = {}
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FiltersProvider>
            {ui}
          </FiltersProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

export function makeProduct(overrides: Partial<import('@/types').Product> = {}): import('@/types').Product {
  return {
    id: 1,
    title: 'Test Product',
    description: 'A great product for testing.',
    price: 49.99,
    discountPercentage: 10,
    rating: 4.2,
    stock: 25,
    brand: 'TestBrand',
    category: 'electronics',
    thumbnail: 'https://example.com/thumb.jpg',
    images: ['https://example.com/img1.jpg'],
    tags: ['test', 'mock'],
    sku: 'SKU-001',
    weight: 1.2,
    availabilityStatus: 'In Stock',
    minimumOrderQuantity: 1,
    meta: {
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-03-10T12:00:00.000Z',
      barcode: '1234567890',
      qrCode: 'https://example.com/qr.png',
    },
    ...overrides,
  }
}

export function makeProductList(count = 10) {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({
      id: i + 1,
      title: `Product ${i + 1}`,
      brand: i % 2 === 0 ? 'BrandA' : 'BrandB',
      category: i % 3 === 0 ? 'electronics' : 'clothing',
      price: 10 + i * 5,
      stock: i === 0 ? 0 : i * 3,
    })
  )
}
