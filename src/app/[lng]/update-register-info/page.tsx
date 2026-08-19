import { getTranslation } from '@/app/i18n'
import TopNavBar from '@/components/navbar/top-nav-bar'
import PublicLayout from '@/layout/public-layout'
import tenantServiceInstance from '@/lib/services/tenants'
import { headers } from 'next/headers'
import Link from 'next/link'
import UpdateRegisterCard from './_components/UpdateRegisterCard'

export default async function Register({ params: { lng } }: any) {
  const { t } = await getTranslation(lng)
  const headerList = headers()
  const host = headerList?.get('x-forwarded-host') || headerList?.get('host')
  const tenant =
    host?.split('.')?.[0] &&
    (host?.split('.')?.[0] !== 'atraslink' ||
      host?.split('.')?.[0] !== (process.env.NEXT_PUBLIC_HOST! || 'dashboard'))
      ? host?.split('.')?.[0]
      : undefined
  let res = await tenantServiceInstance.getTenantByNameVerified(
    host?.includes('localhost') ? process.env.NEXT_PUBLIC_TENANT_DOMAIN! : tenant!
  )
  let result = await res.json()
  return (
    <PublicLayout>
      <TopNavBar lng={lng} />
      <main className="h-[calc(100vh_-_9rem)]">
        <UpdateRegisterCard lng={lng} host={result.name} />
      </main>
      <footer className="flex justify-center gap-2 flex-col py-5 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground w-full text-center">
          {' '}
          {t('AtrasLink')} &copy; {new Date().getFullYear()} {t('AllRightsReserved')}
        </p>
        <nav className="m-auto flex gap-3 text-center">
          <Link
            href={`/${lng}/terms-and-conditions`}
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            {t('TermsOfService')}
          </Link>
          <Link
            href={`/${lng}/privacy-policy`}
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            {t('Privacy')}
          </Link>
        </nav>
      </footer>
    </PublicLayout>
  )
}
