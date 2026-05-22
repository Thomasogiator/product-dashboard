import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { fetchCategories, fetchAllProducts } from '../../lib/api'
import { queryKeys } from '../../lib/queryKeys'
import { useFilters } from '../../lib/FiltersContext'
import styles from './ProductFilters.module.css'

export function ProductFilters() {
  const { filters, setFilter, resetFilters } = useFilters()
  const searchRef = useRef<HTMLInputElement>(null)

  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: Infinity,
  })

  const { data: allProducts = [] } = useQuery({
    queryKey: queryKeys.allProducts(),
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 10,
  })

  const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].sort()

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.minPrice ||
    filters.maxPrice

  useEffect(() => {
    const el = searchRef.current
    if (!el) return
    const handler = setTimeout(() => {
      setFilter('search', el.value)
    }, 300)
    return () => clearTimeout(handler)
  }, [])

  return (
    <div className={styles.wrapper} role="search" aria-label="Product filters">
      <div className={styles.topRow}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search products…"
            defaultValue={filters.search}
            onChange={(e) => {
              clearTimeout((e.target as any)._timer)
              ;(e.target as any)._timer = setTimeout(() => setFilter('search', e.target.value), 300)
            }}
            className={styles.search}
            aria-label="Search products by name"
            id="product-search"
          />
        </div>

        <div className={styles.selectWrap}>
          <label htmlFor="sort-order" className="sr-only">Sort by date</label>
          <select
            id="sort-order"
            value={filters.sortOrder}
            onChange={(e) => setFilter('sortOrder', e.target.value as 'newest' | 'oldest')}
            className={styles.select}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={resetFilters} className={styles.resetBtn} aria-label="Clear all filters">
            <RotateCcw size={13} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      <div className={styles.bottomRow}>
        <SlidersHorizontal size={13} className={styles.filterIcon} aria-hidden="true" />

        <div className={styles.selectWrap}>
          <label htmlFor="filter-category" className="sr-only">Filter by category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className={styles.select}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrap}>
          <label htmlFor="filter-brand" className="sr-only">Filter by brand</label>
          <select
            id="filter-brand"
            value={filters.brand}
            onChange={(e) => setFilter('brand', e.target.value)}
            className={styles.select}
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className={styles.priceRange}>
          <label htmlFor="min-price" className="sr-only">Minimum price</label>
          <input
            id="min-price"
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => setFilter('minPrice', e.target.value)}
            className={`${styles.select} ${styles.priceInput}`}
            min="0"
          />
          <span className={styles.priceSep} aria-hidden="true">–</span>
          <label htmlFor="max-price" className="sr-only">Maximum price</label>
          <input
            id="max-price"
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            className={`${styles.select} ${styles.priceInput}`}
            min="0"
          />
        </div>
      </div>
    </div>
  )
}
