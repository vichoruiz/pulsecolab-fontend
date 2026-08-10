import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageCircle,
  ClipboardCheck,
  ListChecks,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getUserRole } from '@/lib/api'

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HRBP', 'LIDER'] },
  { to: '/equipos', label: 'Equipos', icon: Building2, roles: ['ADMIN', 'HRBP'] },
  { to: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
  { to: '/mediciones', label: 'Mediciones', icon: ClipboardCheck, roles: ['ADMIN', 'HRBP', 'LIDER'] },
  { to: '/acciones', label: 'Acciones', icon: ListChecks, roles: ['ADMIN', 'HRBP', 'LIDER', 'COLABORADOR'] },
  { to: '/conversaciones', label: 'Conversaciones', icon: MessageCircle, roles: ['ADMIN', 'HRBP'] },
]

export default function Layout() {
  const navigate = useNavigate()
  const rol = getUserRole()
  const items = ITEMS.filter((item) => item.roles.includes(rol))

  function logout() {
    localStorage.removeItem('pulsecolab_token')
    localStorage.removeItem('pulsecolab_empresa_id')
    navigate('/login')
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="px-2 text-sm font-semibold text-slate-900">PulseColab</span>
          {rol && <span className="px-2 text-xs text-slate-500">Rol: {rol}</span>}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center gap-2 font-medium text-slate-900' : 'flex items-center gap-2 text-slate-600'
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 p-6">
        <SidebarTrigger className="mb-4 md:hidden" />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}