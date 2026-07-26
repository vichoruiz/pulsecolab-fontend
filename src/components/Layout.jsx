import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Building2, Users, MessageCircle, LogOut } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/equipos', label: 'Equipos', icon: Building2 },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
]

export default function Layout() {
  function logout() {
    localStorage.removeItem('pulsecolab_token')
    localStorage.removeItem('pulsecolab_empresa_id')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="text-lg font-semibold">PulseColab AI</div>
            <div className="text-sm text-slate-500">People Intelligence</div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
            <h1 className="text-xl font-semibold text-slate-900">Panel interno</h1>
            <p className="text-sm text-slate-500">
              Administración de empresas, equipos, usuarios y análisis
            </p>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}