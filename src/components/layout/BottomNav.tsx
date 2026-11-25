import { NavLink } from 'react-router'
import { appContent } from '../../lib/content/common'
import type { ResolvedNavItem } from './navigation'

/**
 * Fast tab-meny nederst på mobil, innen rekkevidde for tommelen.
 * «Registrer» vises som en stor, hevet rund knapp i midten.
 * Skjules fra «sm» og opp (der brukes TopNav). display:none fjerner den også for skjermlesere,
 * så det finnes bare én hovedmeny om gangen.
 */
export function BottomNav({ items }: { items: ResolvedNavItem[] }) {
  // Legg den fremhevede handlingen i midten
  const primary = items.find((i) => i.primary)
  const rest = items.filter((i) => !i.primary)
  const ordered = primary ? [...rest.slice(0, 2), primary, ...rest.slice(2)] : rest

  return (
    <nav
      aria-label={appContent.mainNavLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border/40 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      <ul className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))` }}>
        {ordered.map(({ to, label, icon: Icon, primary: isPrimary }) => (
          <li key={to} className="flex justify-center">
            <NavLink
              to={to}
              end={to === '/'}
              className="group flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 pt-1.5 pb-2 text-sm font-semibold"
            >
              {({ isActive }) =>
                isPrimary ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={`-mt-7 flex size-14 items-center justify-center rounded-full border-4 border-surface shadow-md transition-transform group-active:scale-95 ${
                        isActive ? 'bg-brand text-on-brand' : 'bg-on-brand text-brand-action-icon'
                      }`}
                    >
                      <Icon className="size-7" strokeWidth={2.5} />
                    </span>
                    <span className="leading-none">{label}</span>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                        isActive ? 'bg-brand text-on-brand' : 'text-ink-muted'
                      }`}
                    >
                      <Icon className="size-6" strokeWidth={2.25} />
                    </span>
                    <span className={`leading-none ${isActive ? 'text-ink' : 'text-ink-muted'}`}>{label}</span>
                  </>
                )
              }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
