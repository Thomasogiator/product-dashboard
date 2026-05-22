import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingDown } from 'lucide-react'
import type { Product } from '../../types'
import { formatCurrency, formatDate, getStockStatus } from '../../lib/utils'
import { Badge, Skeleton, StarRating } from '../../components/ui/UI'
import styles from './ProductTable.module.css'

interface Props {
  products: Product[]
  isLoading: boolean
}

export function ProductTable({ products, isLoading }: Props) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label="Products loading">
          <TableHead />
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className={styles.skeletonRow}>
                <td><Skeleton height={36} width={36} /></td>
                <td><Skeleton height={14} width="70%" /></td>
                <td><Skeleton height={14} width="60%" /></td>
                <td><Skeleton height={14} width="50%" /></td>
                <td><Skeleton height={14} width="40%" /></td>
                <td><Skeleton height={14} width="40%" /></td>
                <td><Skeleton height={14} width="50%" /></td>
                <td><Skeleton height={14} width={24} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap} role="region" aria-label="Products list">
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th scope="col" className={styles.thImg}></th>
        <th scope="col">Product</th>
        <th scope="col">Brand</th>
        <th scope="col">Category</th>
        <th scope="col">Price</th>
        <th scope="col">Rating</th>
        <th scope="col">Stock</th>
        <th scope="col">Added</th>
        <th scope="col"><span className="sr-only">View</span></th>
      </tr>
    </thead>
  )
}

function ProductRow({ product, onClick }: { product: Product; onClick: () => void }) {
  const stock = getStockStatus(product.stock)
  const discounted = product.discountPercentage > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <tr
      className={styles.row}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.title}`}
    >
      <td className={styles.tdImg}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.thumb}
          loading="lazy"
          width={36}
          height={36}
        />
      </td>
      <td className={styles.tdTitle}>
        <p className={styles.title}>{product.title}</p>
        {product.sku && <p className={styles.sku}>SKU: {product.sku}</p>}
      </td>
      <td className={styles.tdMuted}>{product.brand ?? '—'}</td>
      <td>
        <Badge variant="default">{product.category}</Badge>
      </td>
      <td className={styles.tdPrice}>
        <span className={styles.price}>{formatCurrency(product.price)}</span>
        {discounted && (
          <span className={styles.discount}>
            <TrendingDown size={10} aria-hidden="true" />
            {product.discountPercentage.toFixed(0)}%
          </span>
        )}
      </td>
      <td><StarRating rating={product.rating} /></td>
      <td>
        <span className={styles.stockBadge} style={{ color: stock.color }}>
          <span className={styles.stockDot} style={{ background: stock.color }} aria-hidden="true" />
          {product.stock} · {stock.label}
        </span>
      </td>
      <td className={styles.tdMuted}>
        {product.meta?.createdAt ? formatDate(product.meta.createdAt) : '—'}
      </td>
      <td>
        <ChevronRight size={15} className={styles.chevron} aria-hidden="true" />
      </td>
    </tr>
  )
}
