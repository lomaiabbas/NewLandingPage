import PublicLayout from '@/layout/public-layout';
import React from 'react'
import Navbar from './navbar';
import Hero from './hero';
import Features from './features';
import AboutUs from './about-us';
import WhyUs from './why-us';
import ContactUs from './contact-us';
import Footer from './footer';
import OurClients from './our-clients';
import SocialProof from './social-proof';
import styles from './landing-page.module.css';

export default function LandingPage({lng}:{lng:string}) {
    return (
        <PublicLayout>
            <div className={`relative ${styles.landingPage}`}>

                <Navbar lng={lng} />
                <Hero lng={lng} />
                <Features lng={lng} />
                <AboutUs lng={lng} />
                <WhyUs lng={lng} />
                <OurClients lng={lng} />
                <ContactUs lng={lng} />
                <Footer lng={lng} />
                <SocialProof lng={lng} />
            </div>

        </PublicLayout>
    );
}
