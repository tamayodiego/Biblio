import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getAuthHeader, setCredentials, clearCredentials } from './authStorage'
import { getMiCuenta } from '@/api/miCuenta'
import { ApiError } from '@/api/client'
import type { MiCuenta } from '@/api/types'

interface AuthContextValue {
  user: MiCuenta | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MiCuenta | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!getAuthHeader()) {
      setIsLoading(false)
      return
    }
    getMiCuenta()
      .then(setUser)
      .catch(() => clearCredentials())
      .finally(() => setIsLoading(false))
  }, [])

  async function login(username: string, password: string) {
    setCredentials(username, password)
    try {
      const perfil = await getMiCuenta()
      setUser(perfil)
    } catch (err) {
      clearCredentials()
      if (err instanceof ApiError && err.status === 401) {
        throw new Error('Usuario o contraseña incorrectos.')
      }
      throw new Error('No se pudo conectar con el servidor.')
    }
  }

  function logout() {
    clearCredentials()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
