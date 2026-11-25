import { useSearchParams } from 'react-router'
import { LogIn, Recycle, ShoppingBag } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Alert } from '../components/ui/Alert'
import { ButtonLink } from '../components/ui/ButtonLink'
import { Card } from '../components/ui/Card'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { PantForm } from '../components/sections/register/PantForm'
import { ExpenseForm } from '../components/sections/register/ExpenseForm'
import { useAuth } from '../hooks/useAuth'
import { authText } from '../lib/content/auth'
import { registerText } from '../lib/content/forms'

type Kind = 'pant' | 'expense'

/** ?type=utgift i adressen åpner utgiftsskjemaet direkte (brukes av «Utgift»-knappen på oversikten). */
const EXPENSE_PARAM = 'utgift'

export function RegisterPage() {
  const { status, isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const kind: Kind = searchParams.get('type') === EXPENSE_PARAM ? 'expense' : 'pant'

  const setKind = (next: Kind) =>
    setSearchParams(next === 'expense' ? { type: EXPENSE_PARAM } : {}, { replace: true })

  if (status === 'loading' || (status === 'signedIn' && isAdmin === null)) {
    return (
      <p role="status" className="text-ink-muted">
        {authText.checking}
      </p>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <PageHeader title={registerText.title} />
        <Alert title={registerText.needLogin}>
          <ButtonLink to="/logg-inn" icon={LogIn}>
            {registerText.needLoginLink}
          </ButtonLink>
        </Alert>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow={registerText.eyebrow} title={registerText.title} intro={registerText.intro} />

      <div className="mb-6">
        <SegmentedControl<Kind>
          label={registerText.tabsLabel}
          value={kind}
          onChange={setKind}
          options={[
            { value: 'pant', label: registerText.pantTab, icon: Recycle },
            { value: 'expense', label: registerText.expenseTab, icon: ShoppingBag },
          ]}
        />
      </div>

      {kind === 'pant' ? (
        <Card heading={registerText.pantHeading} icon={Recycle} iconTone="green">
          <div className="mt-6">
            <PantForm />
          </div>
        </Card>
      ) : (
        <Card heading={registerText.expenseHeading} icon={ShoppingBag} iconTone="pink">
          <div className="mt-6">
            <ExpenseForm />
          </div>
        </Card>
      )}
    </>
  )
}
