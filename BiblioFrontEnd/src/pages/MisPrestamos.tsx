import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PrestamoCard } from '@/components/PrestamoCard'
import { getPrestamos, renovarPrestamo, pagarMulta } from '@/api/prestamos'
import { getLibros } from '@/api/libros'
import { ApiError } from '@/api/client'

export function MisPrestamos() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: prestamos, isLoading: loadingPrestamos } = useQuery({
    queryKey: ['prestamos'],
    queryFn: getPrestamos,
  })
  const { data: libros } = useQuery({ queryKey: ['libros'], queryFn: () => getLibros() })
  const librosPorId = new Map((libros ?? []).map((l) => [l.id, l]))

  const renovarMutation = useMutation({
    mutationFn: renovarPrestamo,
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['prestamos'] })
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo renovar.'),
  })

  const pagarMultaMutation = useMutation({
    mutationFn: pagarMulta,
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['prestamos'] })
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo pagar la multa.'),
  })

  if (loadingPrestamos) return <p className="text-muted-foreground">Cargando...</p>

  const activos = (prestamos ?? []).filter((p) => p.activo)
  const historial = (prestamos ?? []).filter((p) => !p.activo)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Mis préstamos</h1>
        <p className="text-muted-foreground">
          Consulta tus préstamos activos, fechas de entrega y historial de devoluciones.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Préstamos activos</h2>
        {activos.length === 0 && (
          <p className="text-sm text-muted-foreground">No tienes préstamos activos.</p>
        )}
        {activos.map((prestamo) => (
          <PrestamoCard
            key={prestamo.id}
            prestamo={prestamo}
            libro={librosPorId.get(prestamo.libro)}
            onRenovar={() => renovarMutation.mutate(prestamo.id)}
            renovando={renovarMutation.isPending && renovarMutation.variables === prestamo.id}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Historial</h2>
        {historial.length === 0 && (
          <p className="text-sm text-muted-foreground">Aún no tienes préstamos devueltos.</p>
        )}
        {historial.map((prestamo) => (
          <PrestamoCard
            key={prestamo.id}
            prestamo={prestamo}
            libro={librosPorId.get(prestamo.libro)}
            onPagarMulta={() => pagarMultaMutation.mutate(prestamo.id)}
            pagando={pagarMultaMutation.isPending && pagarMultaMutation.variables === prestamo.id}
          />
        ))}
      </section>
    </div>
  )
}
