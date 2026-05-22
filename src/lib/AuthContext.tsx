import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '@/types'

interface AuthContextValue {
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS: Record<string, string> = {
  admin: 'password123',
  thomas: 'frontend2024',
  ops: 'ops1234',
}

const TOKEN_KEY = 'ops_dash_token'
const USER_KEY = 'ops_dash_user'

function persistAuth(user: AuthUser) {
  sessionStorage.setItem(TOKEN_KEY, user.token)
  sessionStorage.setItem(USER_KEY, user.username)
}

function clearAuth() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

function loadPersistedAuth(): AuthUser | null {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const username = sessionStorage.getItem(USER_KEY)
  if (token && username) return { token, username }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadPersistedAuth)

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600))

    const expectedPassword = MOCK_USERS[username.toLowerCase()]
    if (!expectedPassword || expectedPassword !== password) {
      throw new Error('Invalid credentials. Try: admin / password123')
    }

    const authUser: AuthUser = {
      username,
      token: `mock-jwt-${Date.now()}-${username}`,
    }
    setUser(authUser)
    persistAuth(authUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
