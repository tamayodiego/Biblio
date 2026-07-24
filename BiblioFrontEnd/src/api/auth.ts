import { apiFetch } from './client'
import { setTokens, setAccessToken, getRefreshToken } from '@/auth/authStorage'

interface TokenPair {
  access: string
  refresh: string
}

// Login: pide el par de tokens al backend con usuario+password y los guarda.
// El password viaja UNA sola vez, aquí; nunca se guarda.
export async function obtenerTokens(username: string, password: string): Promise<void> {
  const data = await apiFetch<TokenPair>('/api/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setTokens(data.access, data.refresh)
}

// Refresh: usa el refresh token para conseguir un access nuevo, sin re-loguear.
export async function refrescarAccess(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No hay refresh token')
  const data = await apiFetch<{ access: string }>('/api/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
  setAccessToken(data.access)
  return data.access
}