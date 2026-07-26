import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Equipos from './pages/Equipos'
import Usuarios from './pages/Usuarios'
import Chats from './pages/Chats'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('pulsecolab_token')
  return token ? children : <Navigate to="/login" replace />
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
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="equipos" element={<Equipos />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="chats" element={<Chats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}