import { Outlet } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-6 py-4">
          <PanelLeft className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Panel de actividades</span>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
