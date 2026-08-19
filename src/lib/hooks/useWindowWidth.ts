import { useState, useEffect } from 'react';

export function useWindowWidth() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            handleResize(); // Set initial width
            window.addEventListener('resize', handleResize);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { width };
}
