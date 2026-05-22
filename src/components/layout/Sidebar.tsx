import { NavLink } from 'react-router-dom'
import { LayoutGrid, LogOut, Package } from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">O</div>
        <div>
          <p className={styles.brandName}>ProdDash</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Navigation</p>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <LayoutGrid size={16} aria-hidden="true" />
          Products
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar} aria-hidden="true">
            {user?.username[0].toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.username}>{user?.username}</p>
            <p className={styles.userRole}>Operations</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={styles.logoutBtn}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={15} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
