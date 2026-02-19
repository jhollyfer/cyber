import canvasConfetti from 'canvas-confetti';
import { useEffect } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      canvasConfetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#A480F5', '#3168F7', '#FB80C1', '#31E1F7'],
      });
      canvasConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A480F5', '#3168F7', '#FB80C1', '#31E1F7'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return null;
}
