import { useLocation } from 'react-router-dom'
import { Package } from 'lucide-react'
import styles from './Header.module.css'

const TITLES: Record<string, string> = {
  '/products': 'Products',
}

export function Header() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = TITLES[base] ?? 'ProdDash'

  return (
    <header className={styles.header} role="banner">
      <div className={styles.left}>
        <Package size={16} className={styles.icon} aria-hidden="true" />
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        <span className={styles.badge}>
          <span className={styles.dot} aria-hidden="true" />
          Live
        </span>
      </div>
    </header>
  )
}
