import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { CirclePlus, LogIn, LogOut, RotateCcw, UserRound } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { ButtonLink } from '../components/ui/ButtonLink'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../hooks/useAuth'
import { authText } from '../lib/content/auth'
import { loginContent } from '../lib/content/pages'

export function LoginPage() {
  const { status, user, isAdmin, adminCheckError, isCheckingAdmin, recheckAdmin, signIn, signOut } = useAuth()

  if (status === 'loading') {
    return (
      <p role="status" className="text-ink-muted">
        {authText.checking}
      </p>
    )
  }

  if (status === 'signedIn' && user) {
    return (
      <>
        <PageHeader title={loginContent.signedInTitle} />
        <Card heading={authText.signedInAs(user.email ?? '')} icon={UserRound} iconTone="yellow" className="max-w-2xl">
          <div className="mt-6 flex flex-col items-start gap-5">
            {isAdmin === null && (
              <p role="status" className="text-ink-muted">
                {authText.checking}
              </p>
            )}
            {isAdmin === true && (
              <>
                <Alert tone="success" title={authText.adminYes} />
                <ButtonLink to="/registrer" icon={CirclePlus} size="lg">
                  {authText.goToRegister}
                </ButtonLink>
              </>
            )}
            {isAdmin === false && (
              <Alert title={adminCheckError ? authText.adminCheckFailed : authText.adminNo}>
                {adminCheckError && <code className="text-ink-muted">{adminCheckError}</code>}
                <p>
                  {authText.userIdLabel}: <code className="font-semibold break-all select-all">{user.id}</code>
                </p>
                <Button variant="secondary" icon={RotateCcw} disabled={isCheckingAdmin} onClick={recheckAdmin}>
                  {isCheckingAdmin ? authText.rechecking : authText.recheck}
                </Button>
              </Alert>
            )}
            <Button variant="secondary" icon={LogOut} onClick={() => void signOut()}>
              {authText.signOut}
            </Button>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader title={loginContent.title} intro={loginContent.intro} />
      <LoginForm signIn={signIn} />
    </>
  )
}

function LoginForm({ signIn }: { signIn: ReturnType<typeof useAuth>['signIn'] }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (email.trim() === '' || password === '') {
      setError(authText.missingFields)
      return
    }
    setPending(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    setPending(false)
    if (result.ok) {
      void navigate('/registrer')
    } else {
      setError(result.error)
    }
  }

  return (
    <Card heading={authText.formHeading} icon={LogIn} className="max-w-xl">
      <form onSubmit={(e) => void handleSubmit(e)} noValidate className="mt-6 flex flex-col gap-6">
        {error && (
          <Alert title={authText.errorTitle}>
            <p>{error}</p>
          </Alert>
        )}
        <TextField
          id="login-email"
          type="email"
          label={authText.email}
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="login-password"
          type="password"
          label={authText.password}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" icon={LogIn} disabled={pending} className="w-fit">
          {pending ? authText.submitting : authText.submit}
        </Button>
      </form>
    </Card>
  )
}
