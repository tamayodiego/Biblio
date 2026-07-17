import { apiFetch } from './client'
import type { Prestamo } from './types'

export function getPrestamos(): Promise<Prestamo[]> {
  return apiFetch<Prestamo[]>('/api/prestamos/')
}

export function crearPrestamo(libroId: number, usuarioId: number): Promise<Prestamo> {
  return apiFetch<Prestamo>('/api/prestamos/', {
    method: 'POST',
    body: JSON.stringify({ libro: libroId, usuario: usuarioId }),
  })
}

export function renovarPrestamo(id: number): Promise<{ mensaje: string; prestamo: Prestamo }> {
  return apiFetch(`/api/prestamos/${id}/renovar/`, { method: 'POST' })
}

export function pagarMulta(id: number): Promise<{ mensaje: string; prestamo: Prestamo }> {
  return apiFetch(`/api/prestamos/${id}/pagar-multa/`, { method: 'POST' })
}
