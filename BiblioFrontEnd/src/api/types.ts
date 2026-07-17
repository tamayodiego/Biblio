export interface Libro {
  id: number
  titulo: string
  autor: string
  isbn: string
  fecha_publicacion: string
  unidades: number
  unidades_disponibles: number
  en_multa: boolean
  genero: string
  paginas: number | null
  sinopsis: string
  portada_url: string
}

export interface Prestamo {
  id: number
  libro: number
  usuario: number
  fecha_prestamo: string | null
  fecha_devolucion: string | null
  fecha_devolucion_real: string | null
  activo: boolean
  renovacion_consumida: boolean
  monto_multa: string
}

export interface MiCuenta {
  id: number
  nombre_completo: string
  email: string
  numero_lector: string
  telefono: string
  miembro_desde: string
  activo: boolean
  libros_leidos: number
  prestamos_activos: number
}
