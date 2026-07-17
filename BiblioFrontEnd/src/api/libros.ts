import { apiFetch } from './client'
import type { Libro } from './types'

export function getLibros(search?: string): Promise<Libro[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiFetch<Libro[]>(`/api/libros/${query}`)
}

export function getLibro(id: number | string): Promise<Libro> {
  return apiFetch<Libro>(`/api/libros/${id}/`)
}
