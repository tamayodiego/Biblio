import { NavLink } from 'react-router-dom'
import { Home, User, BookOpen, Search, Library, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/auth/AuthContext'

const links = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/mi-cuenta', label: 'Mi cuenta', icon: User },
  { to: '/mis-prestamos', label: 'Mis préstamos', icon: BookOpen },
  { to: '/buscar', label: 'Buscar libro', icon: Search },
]

export function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="flex w-64 flex-col self-stretch border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-5">
        <Library className="size-5" />
        <span className="text-lg font-semibold">Biblioteca</span>
      </div>

      <nav className="flex-1 px-3">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Actividades
        </p>
        <ul className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent/60'
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
