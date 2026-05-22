import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Filters } from '@/types'

interface FiltersContextValue {
  filters: Filters
  page: number
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  brand: 'all',
  minPrice: '',
  maxPrice: '',
  sortOrder: 'newest',
}

const FiltersContext = createContext<FiltersContextValue | null>(null)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    setPage(1)
  }, [])

  return (
    <FiltersContext.Provider value={{ filters, page, setFilter, setPage, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider')
  return ctx
}
