import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { AuthUser, Role } from '#/types'
import { TOKEN_KEY, USER_KEY } from '#/api'
import { authService } from '#/api/services/auth.service'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  ready: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (data: {
    name: string
    email: string
    password: string
    role: Role
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY)
    const storedUser = window.localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser) as AuthUser)
      } catch {
        setUser(null)
      }
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
      window.localStorage.removeItem(USER_KEY)
    }
    setReady(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login({ email, password })
    const nextUser: AuthUser = {
      email: data.email,
      role: data.role,
      name: data.name,
    }
    window.localStorage.setItem(TOKEN_KEY, data.token)
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(data.token)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      role: Role
    }) => {
      await authService.register(data)
    },
    [],
  )

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [user, token, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
