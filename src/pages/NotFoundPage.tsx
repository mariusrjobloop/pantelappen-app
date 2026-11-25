import { House } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { ButtonLink } from '../components/ui/ButtonLink'
import { notFoundContent } from '../lib/content/pages'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title={notFoundContent.title} intro={notFoundContent.intro} />
      <ButtonLink to="/" icon={House}>
        {notFoundContent.backLink}
      </ButtonLink>
    </>
  )
}
