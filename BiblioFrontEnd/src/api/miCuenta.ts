import { apiFetch } from './client'
import type { MiCuenta } from './types'

export function getMiCuenta(): Promise<MiCuenta> {
  return apiFetch<MiCuenta>('/api/mi-cuenta/')
}
