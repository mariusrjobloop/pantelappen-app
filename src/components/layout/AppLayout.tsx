import { NavLink, Outlet } from 'react-router'
import { Recycle } from 'lucide-react'
import { SkipLink } from '../ui/SkipLink'
import { IconBadge } from '../ui/IconBadge'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'
import { resolveNavItems } from './navigation'
import { useAuth } from '../../hooks/useAuth'
import { appContent } from '../../lib/content/common'

const MAIN_ID = 'hovedinnhold'

export function AppLayout() {
  const { status, isAdmin } = useAuth()
  const items = resolveNavItems(isAdmin, status === 'signedIn')

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink targetId={MAIN_ID} label={appContent.skipLink} />

      <header>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 pt-5 pb-2 sm:pt-6">
          <NavLink to="/" className="inline-flex min-h-tap w-fit items-center gap-3 rounded-2xl">
            <IconBadge icon={Recycle} tone="green" size="md" className="-rotate-6" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{appContent.wordmark}</span>
              <span className="mt-1 text-sm text-ink-muted">{appContent.tagline}</span>
            </span>
          </NavLink>
          <TopNav items={items} />
        </div>
      </header>

      {/* Ekstra bunnmarg på mobil, så innholdet ikke havner bak bunnmenyen */}
      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-8 focus:outline-none sm:pt-8"
      >
        <Outlet />
      </main>

      <footer className="pb-28 sm:pb-0">
        <p className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-8 text-ink-muted">
          <Recycle aria-hidden="true" className="size-5 shrink-0" />
          {appContent.footer}
        </p>
      </footer>

      <BottomNav items={items} />
    </div>
  )
}
