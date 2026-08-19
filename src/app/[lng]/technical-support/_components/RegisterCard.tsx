'use client';

import { getClientTranslation } from '@/app/i18n/client';
import React from 'react'

export default function RegisterCard({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);


  return (
    <section className="banner banner-one relative min-h-screen register">
      <div className="circle-shape" data-parallax="{&quot;y&quot; : 230}" style={{
        transform: 'translate3d(0px, 0.029px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)',
        // '-webkit-transform': 'translate3d(0px, 0.029px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)'
      }}>
        <img src="/images/circle-shape.png" alt="circle" />
      </div>
      <div className="container">
        <div className="banner-content-wrap mt-[30px] min-h-screen h-screen flex justify-center items-center">
          <div className=' min-w-full w-full'>
           
          </div>
        </div>
      </div>
    </section>
  );
}
