import Navbar from '@/components/landing-page/navbar'
import PublicLayout from '@/layout/public-layout'
import Terms from './_components'

export default async function PrivacyPolicy({ params: { lng } }: any) {
  return (
    <PublicLayout>
      <Navbar lng={lng} />
      <Terms lng={lng} />
    </PublicLayout>
  )
}
