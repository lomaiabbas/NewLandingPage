import Image from 'next/image'
import React from 'react'

export default function Star1({ styles }: { styles: any }) {
    return (
        <div className={`${styles.spin}  ${styles.star1}`}>
            <Image src="/images/star-17.png" alt="star2" width={55} height={55} />
        </div>
    )
}
