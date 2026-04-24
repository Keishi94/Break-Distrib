import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  Package,
  Route,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { BDMark } from '@/components/bd/bd-mark'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  count?: number
}

const items: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', icon: BarChart3, count: 23 },
  { to: '/parc', label: 'Parc', icon: Package, count: 142 },
  { to: '/tournees', label: 'Tournées', icon: Route },
  { to: '/reporting', label: 'Reporting', icon: LineChart },
  { to: '/clients', label: 'Clients', icon: Users },
]

export function SideNav() {
  return (
    <aside className="w-[232px] shrink-0 bg-surface border-r border-border flex flex-col px-2.5 py-3.5">
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-4">
        <BDMark size={22} />
        <div className="font-semibold -tracking-[0.2px]">
          Break<span className="text-bd-orange">'</span>Distrib
        </div>
      </div>

      <nav className="flex flex-col gap-px">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13.5px] transition-colors',
                isActive
                  ? 'bg-surface-3 text-text font-medium'
                  : 'text-text-2 hover:text-text hover:bg-surface-3/60',
              )
            }
          >
            {({ isActive }) => (
              <>
                <it.icon
                  size={17}
                  strokeWidth={1.75}
                  className={cn(isActive && 'text-bd-orange')}
                />
                <span className="flex-1">{it.label}</span>
                {it.count !== undefined && (
                  <span className="font-mono tabular text-[11px] text-text-3">
                    {it.count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="px-2.5 pt-2.5 pb-1.5 border-t border-border mt-2.5">
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-7 h-7 rounded-full bg-bd-orange text-white grid place-items-center text-[12px] font-semibold">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium">Camille Morel</div>
            <div className="text-[11px] text-text-3">Direction</div>
          </div>
          <ChevronRight size={14} className="text-text-3" />
        </div>
      </div>
    </aside>
  )
}
