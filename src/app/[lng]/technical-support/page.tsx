import Navbar from '@/components/landing-page/navbar';
import PublicLayout from '@/layout/public-layout'
import RegisterCard from './_components/RegisterCard';

export default async function PrivacyPolicy({ params: { lng } }: any) {

    return (<PublicLayout>
        <Navbar lng={lng} />
        <RegisterCard lng={lng} />

    </PublicLayout>)
}
