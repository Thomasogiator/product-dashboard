import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZE } from '../../lib/api'
import styles from './Pagination.module.css'

interface Props {
  page: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, total, onPageChange }: Props) {
  const totalPages = Math.ceil(total / PAGE_SIZE)
  if (totalPages <= 1) return null

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <nav className={styles.wrapper} aria-label="Pagination">
      <span className={styles.info}>
        {start}–{end} of {total} products
      </span>

      <div className={styles.controls}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={styles.btn}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`${styles.btn} ${p === page ? styles.active : ''}`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={styles.btn}
          aria-label="Next page"
        >
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
