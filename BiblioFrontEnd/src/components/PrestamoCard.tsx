import { BookOpen, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import type { Libro, Prestamo } from '@/api/types'

interface PrestamoCardProps {
  prestamo: Prestamo
  libro: Libro | undefined
  onRenovar?: () => void
  onPagarMulta?: () => void
  renovando?: boolean
  pagando?: boolean
}

export function PrestamoCard({
  prestamo,
  libro,
  onRenovar,
  onPagarMulta,
  renovando,
  pagando,
}: PrestamoCardProps) {
  const multa = Number(prestamo.monto_multa)
  const vencido = prestamo.activo && multa > 0
  const devuelto = !prestamo.activo

  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
          <BookOpen className="size-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{libro?.titulo ?? `Libro #${prestamo.libro}`}</h3>
          <p className="text-sm text-muted-foreground">{libro?.autor}</p>
          <p className="text-xs text-muted-foreground">
            {devuelto
              ? `Devuelto el ${formatDate(prestamo.fecha_devolucion_real)}`
              : `Fecha de devolución: ${formatDate(prestamo.fecha_devolucion)}`}
          </p>
          {multa > 0 && (
            <p className="text-xs text-destructive">Multa: ${prestamo.monto_multa}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {devuelto ? (
          <Badge variant="success">
            <CheckCircle2 className="size-3" /> Devuelto
          </Badge>
        ) : vencido ? (
          <Badge variant="destructive">
            <AlertCircle className="size-3" /> Vencido
          </Badge>
        ) : (
          <Badge variant="warning">
            <Clock className="size-3" /> En préstamo
          </Badge>
        )}

        {!devuelto && !vencido && !prestamo.renovacion_consumida && onRenovar && (
          <Button size="sm" variant="outline" onClick={onRenovar} disabled={renovando}>
            {renovando ? 'Renovando...' : 'Renovar'}
          </Button>
        )}

        {devuelto && multa > 0 && onPagarMulta && (
          <Button size="sm" variant="outline" onClick={onPagarMulta} disabled={pagando}>
            {pagando ? 'Pagando...' : 'Pagar multa'}
          </Button>
        )}
      </div>
    </Card>
  )
}
