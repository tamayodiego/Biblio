import { useQuery } from '@tanstack/react-query'
import { User, Mail, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatTile } from '@/components/StatTile'
import { getMiCuenta } from '@/api/miCuenta'
import { formatDate } from '@/lib/format'

export function MiCuenta() {
  const { data: cuenta, isLoading } = useQuery({
    queryKey: ['mi-cuenta'],
    queryFn: getMiCuenta,
  })

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>
  if (!cuenta) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Mi cuenta</h1>
        <p className="text-muted-foreground">Aquí puedes ver tu información de lector.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nombre completo</p>
                <p className="font-medium">{cuenta.nombre_completo}</p>
              </div>
            </div>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">Número de lector: </span>
                {cuenta.numero_lector}
              </p>
              <p>
                <span className="text-muted-foreground">Miembro desde: </span>
                {formatDate(cuenta.miembro_desde)}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Estado:</span>
                <Badge variant={cuenta.activo ? 'success' : 'outline'}>
                  {cuenta.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 pt-6">
            <p className="text-sm font-medium">Datos de contacto</p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
                <p>{cuenta.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p>{cuenta.telefono || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <p className="text-sm font-medium">Resumen de actividad</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <StatTile value={cuenta.libros_leidos} label="Libros leídos" />
            <StatTile value={cuenta.prestamos_activos} label="Préstamos activos" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
