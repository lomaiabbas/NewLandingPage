'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedText({ text, replaceText }: { text: string; replaceText: string; }) {
    const [finalText, setFinalText] = useState(text);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setFinalText(replaceText);

    //     }, 7000);
    // },[text]);

    return (
        <motion.span
            id={replaceText}
        style={{ display: 'inline-block' }}
            initial={{ x: 2 }}
            animate={{
                x: [0, -2, 2, -2, 2, 0], // shake effect
                color: 'var(--primary-color)', // color change
              }}
              transition={{
                duration: 1,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            onAnimationComplete={() => {
                setFinalText(replaceText);
            }}
        >
            {finalText}
        </motion.span>
    );
}