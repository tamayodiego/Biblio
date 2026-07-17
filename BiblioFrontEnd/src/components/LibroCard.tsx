import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Libro } from '@/api/types'

interface LibroCardProps {
  libro: Libro
  onPrestar: () => void
  prestando?: boolean
}

export function LibroCard({ libro, onPrestar, prestando }: LibroCardProps) {
  const disponible = libro.unidades_disponibles > 0

  return (
    <Card className="flex flex-col gap-3 p-4">
      <Link to={`/libros/${libro.id}`} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <BookOpen className="size-5 text-muted-foreground" />
          </div>
          <Badge variant={disponible ? 'success' : 'outline'}>
            {disponible ? `${libro.unidades_disponibles} disponibles` : 'Agotado'}
          </Badge>
        </div>
        <div>
          <h3 className="font-medium text-foreground">{libro.titulo}</h3>
          <p className="text-sm text-muted-foreground">{libro.autor}</p>
        </div>
      </Link>
      <Button
        size="sm"
        variant={disponible ? 'default' : 'outline'}
        disabled={!disponible || prestando}
        onClick={onPrestar}
      >
        {disponible ? (prestando ? 'Pidiendo...' : 'Préstamo') : 'Agotado'}
      </Button>
    </Card>
  )
}
