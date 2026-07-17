import { getAuthHeader, clearCredentials } from '@/auth/authStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeader = getAuthHeader()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    clearCredentials()
    throw new ApiError(401, 'Sesión inválida, vuelve a iniciar sesión.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      (body && (body.error || body.detail || JSON.stringify(body))) ||
      `Error ${response.status}`
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
