import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BookOpen, Calendar, Tag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getLibro } from '@/api/libros'
import { crearPrestamo } from '@/api/prestamos'
import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/api/client'

export function LibroDetalle() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: libro, isLoading } = useQuery({
    queryKey: ['libro', id],
    queryFn: () => getLibro(id!),
    enabled: !!id,
  })

  const prestarMutation = useMutation({
    mutationFn: () => crearPrestamo(Number(id), user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libro', id] })
      queryClient.invalidateQueries({ queryKey: ['libros'] })
      queryClient.invalidateQueries({ queryKey: ['prestamos'] })
      navigate('/mis-prestamos')
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo pedir el préstamo.')
    },
  })

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>
  if (!libro) return <p className="text-muted-foreground">Libro no encontrado.</p>

  const disponible = libro.unidades_disponibles > 0
  const anio = libro.fecha_publicacion?.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/buscar" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex aspect-[3/4] w-48 shrink-0 items-center justify-center rounded-lg bg-muted">
          {libro.portada_url ? (
            <img src={libro.portada_url} alt={libro.titulo} className="size-full rounded-lg object-cover" />
          ) : (
            <BookOpen className="size-10 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{libro.titulo}</h1>
              <p className="text-lg text-muted-foreground">{libro.autor}</p>
            </div>
            <Badge variant={disponible ? 'success' : 'outline'}>
              {disponible ? `${libro.unidades_disponibles} disponibles` : 'Agotado'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {anio && (
              <span className="flex items-center gap-1">
                <Calendar className="size-4" /> {anio}
              </span>
            )}
            {libro.genero && (
              <span className="flex items-center gap-1">
                <Tag className="size-4" /> {libro.genero}
              </span>
            )}
            {libro.paginas && (
              <span className="flex items-center gap-1">
                <FileText className="size-4" /> {libro.paginas} páginas
              </span>
            )}
          </div>

          {libro.sinopsis && (
            <div>
              <h2 className="mb-1 text-sm font-medium">Sinopsis</h2>
              <p className="text-sm text-muted-foreground">{libro.sinopsis}</p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            className="mt-2 w-fit"
            disabled={!disponible || prestarMutation.isPending}
            onClick={() => prestarMutation.mutate()}
          >
            {prestarMutation.isPending ? 'Pidiendo...' : disponible ? 'Pedir préstamo' : 'Agotado'}
          </Button>
        </div>
      </div>
    </div>
  )
}
