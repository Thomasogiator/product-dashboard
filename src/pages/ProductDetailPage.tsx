import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Star, Package, Tag, BarChart2, Truck, ShieldCheck } from 'lucide-react'
import { fetchProduct } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import { formatCurrency, formatDate, getStockStatus } from '../lib/utils'
import { PageLoader, ErrorState, Badge, StarRating } from '../components/ui/UI'
import styles from './ProductDetailPage.module.css'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState(0)

  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.product(Number(id)),
    queryFn: () => fetchProduct(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  })

  if (isLoading) return <PageLoader />

  if (isError) {
    return (
      <div className={styles.page}>
        <BackButton onClick={() => navigate(-1)} />
        <ErrorState
          title="Product not found"
          description={(error as Error).message}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!product) return null

  const stock = getStockStatus(product.stock)
  const effectivePrice = product.price * (1 - product.discountPercentage / 100)
  const allImages = product.images?.length ? product.images : [product.thumbnail]

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />

      <div className={styles.grid}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            <img
              src={allImages[activeImage] ?? product.thumbnail}
              alt={product.title}
              className={styles.mainImage}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = product.thumbnail
              }}
            />
            {product.discountPercentage > 0 && (
              <span className={styles.discountBadge} aria-label={`${product.discountPercentage.toFixed(0)}% off`}>
                -{product.discountPercentage.toFixed(0)}%
              </span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className={styles.thumbs} role="list" aria-label="Product images">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  role="listitem"
                  onClick={() => setActiveImage(i)}
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === activeImage}
                >
                  <img src={img} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = product.thumbnail }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.detailHeader}>
            <div className={styles.badges}>
              <Badge variant="accent">{product.category}</Badge>
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            {product.brand && (
              <p className={styles.brand}>by {product.brand}</p>
            )}
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.ratingCount}>({product.rating.toFixed(1)} / 5)</span>
            </div>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatCurrency(effectivePrice)}</span>
            {product.discountPercentage > 0 && (
              <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <dl className={styles.statsGrid}>
            <StatCard icon={<Package size={15} />} label="Stock" value={
              <span style={{ color: stock.color }}>{product.stock} units · {stock.label}</span>
            } />
            <StatCard icon={<Tag size={15} />} label="SKU" value={product.sku ?? '—'} mono />
            <StatCard icon={<BarChart2 size={15} />} label="Min. Order" value={`${product.minimumOrderQuantity} unit${product.minimumOrderQuantity !== 1 ? 's' : ''}`} />
            <StatCard icon={<Truck size={15} />} label="Weight" value={`${product.weight} kg`} />
            <StatCard icon={<ShieldCheck size={15} />} label="Availability" value={product.availabilityStatus ?? '—'} />
            <StatCard icon={<Star size={15} />} label="Discount" value={product.discountPercentage > 0 ? `${product.discountPercentage.toFixed(1)}%` : 'None'} />
          </dl>

          <div className={styles.metaBlock}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Added</span>
              <span className={styles.metaValue}>
                {product.meta?.createdAt ? formatDate(product.meta.createdAt) : '—'}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Updated</span>
              <span className={styles.metaValue}>
                {product.meta?.updatedAt ? formatDate(product.meta.updatedAt) : '—'}
              </span>
            </div>
            {product.meta?.barcode && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Barcode</span>
                <span className={`${styles.metaValue} ${styles.mono}`}>{product.meta.barcode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={styles.backBtn} aria-label="Go back">
      <ArrowLeft size={15} aria-hidden="true" />
      Back to products
    </button>
  )
}

function StatCard({ icon, label, value, mono }: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className={styles.statCard}>
      <dt className={styles.statLabel}>
        <span className={styles.statIcon} aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className={`${styles.statValue} ${mono ? styles.mono : ''}`}>{value}</dd>
    </div>
  )
}
