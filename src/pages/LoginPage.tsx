import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Spinner } from '../components/ui/UI'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/products" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await login(username.trim(), password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">O</div>
          <div>
            <p className={styles.brandName}>ProdDash</p>
            <p className={styles.brandSub}>Product Dashboard</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.headingGroup}>
          <h1 className={styles.heading}>Sign in</h1>
          <p className={styles.sub}>Access your operations workspace</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="e.g. admin"
              autoComplete="username"
              autoFocus
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <button type="submit" disabled={isLoading} className={styles.btn}>
            {isLoading ? (
              <>
                <Spinner size={16} label="Signing in…" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className={styles.hint}>
          <p>Demo credentials:</p>
          <div className={styles.creds}>
            <code>admin</code> / <code>password123</code>
          </div>
        </div>
      </div>
    </div>
  )
}
