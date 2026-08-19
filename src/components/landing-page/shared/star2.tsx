import Image from 'next/image'
import React from 'react'

export default function Star2({ styles, top, right }: { styles: any; top?: boolean; right?: boolean; }) {
  return (
    <div className={`${styles.spin} ${styles.star2} ${top ? styles.top :''} ${right ? styles.right :''}`}>
      <Image src="/images/star-16.png" alt="star1" width={40} height={40} />
    </div>
  )
}
