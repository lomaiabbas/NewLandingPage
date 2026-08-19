import LandingPage from '@/components/landing-page'
import { headers } from 'next/headers'
import { getTranslation } from '../i18n'

export default async function Home({ params: { lng } }: any) {
  const headerList = headers()
  const host = headerList?.get('x-forwarded-host') || headerList?.get('host')
  const tenant =
    host?.split('.')?.[0] &&
    (host?.split('.')?.[0] !== 'atraslink' ||
      host?.split('.')?.[0] !== (process.env.NEXT_PUBLIC_HOST! || 'dashboard'))
      ? host?.split('.')?.[0]
      : undefined

  let result: any
  let content = <></>

  const { t } = await getTranslation(lng)

  return <LandingPage lng={lng} />
}
