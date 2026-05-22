import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Package } from 'lucide-react'
import { fetchProducts } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import { useFilters } from '../lib/FiltersContext'
import { ProductFilters } from '../components/products/ProductFilters'
import { ProductTable } from '../components/products/ProductTable'
import { Pagination } from '../components/products/Pagination'
import { AddProductModal } from '../components/products/AddProductModal'
import { BrandChart } from '../components/charts/BrandChart'
import { ErrorState, EmptyState } from '../components/ui/UI'
import styles from './ProductsPage.module.css'

export function ProductsPage() {
  const { filters, page, setPage } = useFilters()
  const [showModal, setShowModal] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.products(page, filters),
    queryFn: () =>
      fetchProducts({
        page,
        search: filters.search,
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      }),
    placeholderData: (prev) => prev,
  })

  const sortedProducts = useMemo(() => {
    if (!data?.products) return []
    return [...data.products].sort((a, b) => {
      const da = new Date(a.meta?.createdAt ?? 0).getTime()
      const db = new Date(b.meta?.createdAt ?? 0).getTime()
      return filters.sortOrder === 'newest' ? db - da : da - db
    })
  }, [data?.products, filters.sortOrder])

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.minPrice ||
    filters.maxPrice

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.heading}>All Products</h2>
          <p className={styles.sub}>
            {data ? `${data.total.toLocaleString()} products` : 'Loading…'}
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setShowModal(true)}
          aria-label="Add new product"
        >
          <Plus size={15} aria-hidden="true" />
          Add Product
        </button>
      </div>

      <BrandChart />
      <ProductFilters />

      {isError ? (
        <ErrorState
          title="Failed to load products"
          description={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : sortedProducts.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Package size={40} />}
          title="No products found"
          description={
            hasActiveFilters
              ? 'No products match your current filters. Try adjusting your search or filters.'
              : 'No products available.'
          }
          action={
            hasActiveFilters ? (
              <button
                className={styles.clearBtn}
                onClick={() => window.location.reload()}
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <ProductTable products={sortedProducts} isLoading={isLoading} />
          <Pagination
            page={page}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}

      <AddProductModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
