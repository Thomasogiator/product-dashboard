import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../lib/AuthContext'

function AuthConsumer() {
  const { user, login, logout, isAuthenticated } = useAuth()
  return (
    <div>
      <p data-testid="auth">{isAuthenticated ? 'authenticated' : 'guest'}</p>
      <p data-testid="username">{user?.username ?? 'none'}</p>
      <button onClick={() => login('admin', 'password123')}>Login valid</button>
      <button onClick={() => login('admin', 'wrongpass').catch(() => {})}>Login invalid</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  it('starts as unauthenticated', () => {
    renderAuth()
    expect(screen.getByTestId('auth').textContent).toBe('guest')
    expect(screen.getByTestId('username').textContent).toBe('none')
  })

  it('logs in with valid credentials', async () => {
    const user = userEvent.setup()
    renderAuth()
    await user.click(screen.getByText('Login valid'))
    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('authenticated')
      expect(screen.getByTestId('username').textContent).toBe('admin')
    }, { timeout: 2000 })
  })

  it('logs out after being authenticated', async () => {
    const user = userEvent.setup()
    renderAuth()
    await user.click(screen.getByText('Login valid'))
    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('authenticated')
    }, { timeout: 2000 })
    await user.click(screen.getByText('Logout'))
    expect(screen.getByTestId('auth').textContent).toBe('guest')
    expect(screen.getByTestId('username').textContent).toBe('none')
  })
})
