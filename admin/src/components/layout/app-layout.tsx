import { Outlet, useLocation } from 'react-router-dom'
import { SideNav } from './side-nav'
import { TopBar } from './top-bar'

const crumbs: Record<string, string> = {
  '/': 'Dashboard Direction',
  '/pipeline': 'Pipeline commercial',
  '/parc': 'Parc distributeurs',
  '/tournees': 'Planification tournées',
  '/reporting': 'Reporting & KPI',
  '/clients': 'Clients',
  '/mobile': 'Terrain technicien',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const crumb =
    crumbs[pathname] ??
    (pathname.startsWith('/clients/') ? 'Fiche client' : 'Workspace')
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <SideNav />
      <div className="flex flex-col min-w-0">
        <TopBar crumb={crumb} />
        <main className="flex-1 overflow-auto bg-surface-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
