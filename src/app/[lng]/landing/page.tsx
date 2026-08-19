import LandingPage from '@/components/landing-page'
import tenantServiceInstance from '@/lib/services/tenants'
import { headers } from 'next/headers'

interface Props {
  params: {
    lng: string
  }
  searchParams: any
}

export default async function GatekeepPage({ params: { lng }, searchParams }: Props) {
  const headerList = headers()
  const host = headerList?.get('x-forwarded-host') || headerList?.get('host')
  const tenant =
    host?.split('.')?.[0] &&
    (host?.split('.')?.[0] !== 'atraslink' ||
      host?.split('.')?.[0] !== (process.env.NEXT_PUBLIC_HOST! || 'dashboard'))
      ? host?.split('.')?.[0]
      : undefined

  let result: any

  if (
    (!host?.includes('localhost') &&
      !host?.includes('dashboard') &&
      !host?.includes(process.env.NEXT_PUBLIC_HOST!) &&
      host?.includes('.atraslink.com')) ||
    process.env.NEXT_PUBLIC_TENANT_DOMAIN
  ) {
    let res = await tenantServiceInstance.getTenantByNameVerified(
      host?.includes('localhost') ? process.env.NEXT_PUBLIC_TENANT_DOMAIN! : tenant!
    )
    result = await res.json()
  }

  return <LandingPage lng={lng} />
}
