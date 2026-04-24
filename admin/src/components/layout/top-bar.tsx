import { Bell, ChevronRight, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

interface TopBarProps {
  crumb?: string
}

export function TopBar({ crumb = 'Workspace' }: TopBarProps) {
  const { theme, toggle } = useTheme()
  return (
    <div className="h-[52px] border-b border-border flex items-center gap-3 px-5 bg-surface sticky top-0 z-10">
      <div className="flex items-center gap-2 text-text-3 text-[12.5px]">
        <span>Break'Distrib</span>
        <ChevronRight size={12} />
        <span className="text-text">{crumb}</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-2.5 py-[5px] w-[260px]">
        <Search size={15} className="text-text-3" />
        <span className="text-text-3 text-[12.5px]">
          Rechercher client, machine, contrat…
        </span>
        <span className="font-mono ml-auto text-[10.5px] text-text-3 border border-border px-1.5 py-px rounded">
          ⌘K
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
        className="w-8 h-8 rounded-lg border border-border grid place-items-center text-text-2 hover:bg-surface-3 transition-colors"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <button
        type="button"
        aria-label="Notifications"
        className="relative w-8 h-8 rounded-lg border border-border grid place-items-center text-text-2 hover:bg-surface-3 transition-colors"
      >
        <Bell size={15} />
        <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full bg-bd-orange" />
      </button>
    </div>
  )
}
