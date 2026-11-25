import { CirclePlus, History, House, LogIn, ShoppingBag, UserRound, type LucideIcon } from 'lucide-react'
import { accountNav, navItems } from '../../lib/content/common'

export type ResolvedNavItem = {
  to: string
  label: string
  icon: LucideIcon
  /** Fremhevet handling (Registrer), vises som en stor rund knapp i mobilmenyen. */
  primary?: boolean
}

const icons: Record<string, LucideIcon> = {
  '/': House,
  '/historikk': History,
  '/utgifter': ShoppingBag,
  '/registrer': CirclePlus,
}

/** Menypunktene brukeren skal se, i samme rekkefølge for topp- og bunnmeny. */
export function resolveNavItems(isAdmin: boolean | null, signedIn: boolean): ResolvedNavItem[] {
  const items: ResolvedNavItem[] = navItems
    .filter((item) => item.visibleFor === 'all' || isAdmin === true)
    .map((item) => ({ to: item.to, label: item.label, icon: icons[item.to], primary: item.to === '/registrer' }))

  items.push({
    to: accountNav.to,
    label: signedIn ? accountNav.signedInLabel : accountNav.signedOutLabel,
    icon: signedIn ? UserRound : LogIn,
  })
  return items
}
