import Navbar from '@/components/landing-page/navbar';
import PublicLayout from '@/layout/public-layout'
import PrivacyPolicy from './_components';

export default async function PrivacyPolicyPage({ params: { lng } }: any) {

    return (
        <PublicLayout>
            <Navbar lng={lng} />
            <PrivacyPolicy lng={lng} />
        </PublicLayout>
    );
}
