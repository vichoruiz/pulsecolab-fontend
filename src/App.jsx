import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Equipos from './pages/Equipos'
import Usuarios from './pages/Usuarios'
import Mediciones from './pages/Mediciones'
import Acciones from './pages/Acciones'
import Conversaciones from './pages/Conversaciones'
import { getUserRole } from './lib/api'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('pulsecolab_token')
  return token ? children : <Navigate to="/login" replace />
}

function RoleRoute({ roles, children }) {
  const rol = getUserRole()
  if (!rol) return <Navigate to="/login" replace />
  if (!roles.includes(rol)) return <Navigate to="/acciones" replace />
  return children
}

function IndexRedirect() {
  const rol = getUserRole()
  return <Navigate to={rol === 'COLABORADOR' ? '/acciones' : '/dashboard'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<IndexRedirect />} />

          <Route
            path="dashboard"
            element={<RoleRoute roles={['ADMIN', 'HRBP', 'LIDER']}><Dashboard /></RoleRoute>}
          />
          <Route
            path="equipos"
            element={<RoleRoute roles={['ADMIN', 'HRBP']}><Equipos /></RoleRoute>}
          />
          <Route
            path="usuarios"
            element={<RoleRoute roles={['ADMIN']}><Usuarios /></RoleRoute>}
          />
          <Route
            path="mediciones"
            element={<RoleRoute roles={['ADMIN', 'HRBP', 'LIDER']}><Mediciones /></RoleRoute>}
          />
          <Route path="acciones" element={<Acciones />} />
          <Route
            path="conversaciones"
            element={<RoleRoute roles={['ADMIN', 'HRBP']}><Conversaciones /></RoleRoute>}
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}