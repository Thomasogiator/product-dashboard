import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.sub}>The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/products')} className={styles.btn}>
        Back to Products
      </button>
    </div>
  )
}
