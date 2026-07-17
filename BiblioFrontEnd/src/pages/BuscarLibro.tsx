import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LibroCard } from '@/components/LibroCard'
import { getLibros } from '@/api/libros'
import { crearPrestamo } from '@/api/prestamos'
import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/api/client'

export function BuscarLibro() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: libros, isLoading } = useQuery({
    queryKey: ['libros', search],
    queryFn: () => getLibros(search || undefined),
  })

  const prestarMutation = useMutation({
    mutationFn: (libroId: number) => crearPrestamo(libroId, user!.id),
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['libros'] })
      queryClient.invalidateQueries({ queryKey: ['prestamos'] })
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo pedir el préstamo.')
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Buscar libro</h1>
        <p className="text-muted-foreground">Encuentra tu próximo libro en el catálogo de la biblioteca.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título o autor..."
          className="pl-9"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {libros?.map((libro) => (
            <LibroCard
              key={libro.id}
              libro={libro}
              onPrestar={() => prestarMutation.mutate(libro.id)}
              prestando={prestarMutation.isPending && prestarMutation.variables === libro.id}
            />
          ))}
          {libros?.length === 0 && (
            <p className="text-muted-foreground">No se encontraron libros.</p>
          )}
        </div>
      )}
    </div>
  )
}
