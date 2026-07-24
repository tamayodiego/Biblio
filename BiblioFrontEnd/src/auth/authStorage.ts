// Tokens JWT guardados en sessionStorage. Ya NO guardamos usuario:password;
// solo tokens firmados por el backend, que además expiran.
const ACCESS_KEY = 'biblio_access'
const REFRESH_KEY = 'biblio_refresh'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY)
}

export function getAuthHeader(): string | null {
  const access = getAccessToken()
  return access ? `Bearer ${access}` : null
}

export function setTokens(access: string, refresh: string) {
  sessionStorage.setItem(ACCESS_KEY, access)
  sessionStorage.setItem(REFRESH_KEY, refresh)
}

export function setAccessToken(access: string) {
  sessionStorage.setItem(ACCESS_KEY, access)
}

export function clearCredentials() {
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}