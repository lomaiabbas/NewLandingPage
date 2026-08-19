import { getTranslation } from '@/app/i18n'
import TopNavBar from '@/components/navbar/top-nav-bar'
import PublicLayout from '@/layout/public-layout'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Pako from 'pako'
import Onboarding from './_components'

interface Props {
  params: { lng: string; id: number }
  searchParams: any
}

export default async function Home({ params: { lng }, searchParams }: Props) {
  const { t } = await getTranslation(lng)
  const id: number | undefined = searchParams?.id || undefined

  const accessToken = cookies().get('accessToken')

  return (
    <PublicLayout>
      <TopNavBar lng={lng} />
      <main className="h-[calc(100vh_-_9.5rem)]">
        <Onboarding
          id={id!}
          lng={lng}
          accessToken={
            accessToken?.value
              ? Pako.ungzip(Buffer.from(accessToken?.value, 'base64'), { to: 'string' })
              : undefined
          }
        />
      </main>
      <footer className="flex justify-center gap-2 flex-col pb-3 pt-[2rem] w-full shrink-0 items-center px-4 md:px-6 border-t">
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
