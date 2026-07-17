import { Link } from 'react-router-dom'
import { Library } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Inicio() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Library className="size-8" />
      </div>
      <h1 className="text-3xl font-semibold">Bienvenido a la Biblioteca</h1>
      <p className="max-w-md text-muted-foreground">
        Tu espacio para gestionar tu cuenta, revisar préstamos y descubrir tu próxima
        lectura.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild>
          <Link to="/buscar">Buscar un libro</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/mis-prestamos">Ver mis préstamos</Link>
        </Button>
      </div>
    </div>
  )
}
