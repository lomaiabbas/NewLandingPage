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

/* Scales the page with the screen relative to a 1366×650 laptop viewport (see landing-page.module.css).
   The smaller of the two ratios wins, so a wide but short screen doesn't push the hero past the fold.
   Inline and parsed before the page so a large screen never paints the unscaled layout first. */
const LANDING_ZOOM_SCRIPT = `(function(){
  var s = document.getElementById('landing-zoom');
  if (!s) { s = document.createElement('style'); s.id = 'landing-zoom'; document.head.appendChild(s); }
  function update(){
    var z = Math.max(1, Math.min(innerWidth / 1366, innerHeight / 650));
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
