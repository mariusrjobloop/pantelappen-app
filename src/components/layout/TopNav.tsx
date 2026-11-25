import { NavLink } from 'react-router'
import { appContent } from '../../lib/content/common'
import type { ResolvedNavItem } from './navigation'

/** Menyen øverst på nettbrett og PC. Skjules på mobil (der brukes BottomNav). */
export function TopNav({ items }: { items: ResolvedNavItem[] }) {
  return (
    <nav aria-label={appContent.mainNavLabel} className="hidden sm:block">
      <ul className="flex flex-wrap justify-end gap-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `inline-flex min-h-tap items-center gap-2 rounded-full px-4 font-semibold transition-colors ${
                  isActive ? 'bg-brand text-on-brand' : 'text-ink hover:bg-surface-muted'
                }`
              }
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
