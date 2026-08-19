import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function Fireworks() {
  useEffect(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }, []);

  return null;
}
