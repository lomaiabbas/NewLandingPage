import PublicLayout from '@/layout/public-layout';
import React from 'react'
import Navbar from './navbar';
import Hero from './hero';
import Solutions from './solutions';
import Integrations from './integrations';
import GetStarted from './get-started';
import WhyUs from './why-us';
// The "Added value with AtrasLink" section is switched off for now; its files are kept in
// ./added-value. To show it again, uncomment this import and <AddedValue> below.
// import AddedValue from './added-value';
import ContactUs from './contact-us';
import Footer from './footer';
import OurClients from './our-clients';
import SocialProof from './social-proof';
import FloatingSignup from './floating-signup';
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
    var vh = '';
    /* a phone with "desktop site" on: the browser lays out ~980px wide and ~2000px tall, then shrinks
       it to the screen, so the tablet layout comes out tiny with a tall empty hero. Enlarge it to a
       ~600px-wide layout and cap the height it sees. */
    if (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) <= 820 && innerWidth >= 900) {
      z = innerWidth / 600;
      vh = '--landing-vh:' + (Math.min(innerHeight, innerWidth * 0.75) / 100).toFixed(2) + 'px;';
    }
    s.textContent = ':root{--landing-zoom:' + z.toFixed(3) + ';' + vh + '}';
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
                    and </RegisterModalProvider> below. */}
                <RegisterModalProvider lng={lng}>

                <Navbar lng={lng} />
                <Hero lng={lng} />
                {/* band colours alternate: dark hero, light, dark, light, dark, then light to the end */}
                <Solutions lng={lng} />
                <GetStarted lng={lng} />
                <WhyUs lng={lng} />
                {/* <AddedValue lng={lng} /> */}
                <OurClients lng={lng} />
                <Integrations lng={lng} />
                <div className={`container ${styles.sectionDivider}`} aria-hidden />
                <ContactUs lng={lng} />
                <Footer lng={lng} />
                <SocialProof lng={lng} />
                <FloatingSignup lng={lng} />
                </RegisterModalProvider>
            </div>

        </PublicLayout>
    );
}
