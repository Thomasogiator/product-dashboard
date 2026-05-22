import styles from './UI.module.css'

export function Spinner({ size = 20, label = 'Loading…' }: { size?: number; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={styles.spinner}
      style={{ width: size, height: size, borderWidth: size > 24 ? 3 : 2 }}
    />
  )
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader} role="status" aria-live="polite">
      <Spinner size={32} />
      <p className={styles.pageLoaderText}>Loading…</p>
    </div>
  )
}

export function Skeleton({ width, height = 16, className }: {
  width?: string | number
  height?: number
  className?: string
}) {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ''}`}
      style={{ width: width ?? '100%', height }}
      aria-hidden="true"
    />
  )
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent'
export function Badge({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: BadgeVariant
}) {
  return <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>{children}</span>
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className={styles.empty} role="status">
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <p className={styles.emptyTitle}>{title}</p>
      {description && <p className={styles.emptyDesc}>{description}</p>}
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className={styles.error} role="alert">
      <div className={styles.errorIcon} aria-hidden="true">⚠</div>
      <p className={styles.errorTitle}>{title}</p>
      {description && <p className={styles.errorDesc}>{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn}>
          Try again
        </button>
      )}
    </div>
  )
}

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span
      className={styles.stars}
      role="img"
      aria-label={`Rating: ${rating.toFixed(1)} out of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={styles.star}
          style={{ color: i < Math.round(rating) ? '#f59e0b' : 'var(--text-tertiary)' }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
    </span>
  )
}
