import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/auth/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { Inicio } from '@/pages/Inicio'
import { BuscarLibro } from '@/pages/BuscarLibro'
import { LibroDetalle } from '@/pages/LibroDetalle'
import { MisPrestamos } from '@/pages/MisPrestamos'
import { MiCuenta } from '@/pages/MiCuenta'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/buscar" element={<BuscarLibro />} />
              <Route path="/libros/:id" element={<LibroDetalle />} />
              <Route path="/mis-prestamos" element={<MisPrestamos />} />
              <Route path="/mi-cuenta" element={<MiCuenta />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
