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
import RegisterModalProvider from './register-modal/register-modal-provider';
import styles from './landing-page.module.css';

/* Scales the page with the screen relative to a 1366×650 laptop viewport shown at 90%, i.e. as if
   the browser were zoomed out to 90% (see landing-page.module.css). The smaller of the two ratios
   wins, so a wide but short screen doesn't push the hero past the fold. Below the split layout
   (phones, tablets) the page is left at 1. Inline and parsed before the page so a large screen
   never paints the unscaled layout first. */
const LANDING_ZOOM_SCRIPT = `(function(){
  var s = document.getElementById('landing-zoom');
  if (!s) { s = document.createElement('style'); s.id = 'landing-zoom'; document.head.appendChild(s); }
  function update(){
    var z = innerWidth < 992 ? 1 : Math.max(0.9, Math.min(innerWidth / 1518, innerHeight / 722));
    s.textContent = ':root{--landing-zoom:' + z.toFixed(3) + '}';
  }
  update();
  addEventListener('resize', update);
})();`;

export default function LandingPage({lng}:{lng:string}) {
    return (
        <PublicLayout>
            <script dangerouslySetInnerHTML={{ __html: LANDING_ZOOM_SCRIPT }} />
            <div className={`relative ${styles.landingPage}`}>
                {/* The sign-up modal: links to /register on this page open it instead of the page.
                    To go back to the /register page, comment out <RegisterModalProvider lng={lng}>
                    and </RegisterModalProvider> below; nothing else changed. */}
                <RegisterModalProvider lng={lng}>

                <Navbar lng={lng} />
                <Hero lng={lng} />
                <Features lng={lng} />
                <AboutUs lng={lng} />
                <WhyUs lng={lng} />
                <OurClients lng={lng} />
                <ContactUs lng={lng} />
                <Footer lng={lng} />
                <SocialProof lng={lng} />
                </RegisterModalProvider>
            </div>

        </PublicLayout>
    );
}
