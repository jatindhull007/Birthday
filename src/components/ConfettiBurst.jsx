import confetti from 'canvas-confetti';
import { playSfx } from '../lib/audio';

export const fireConfetti = (type = 'otp') => {
  playSfx('sfx-confetti-whoosh');

  if (type === 'otp') {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5865F2', '#FFC876', '#57F287', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  } else if (type === 'quiz') {
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#57F287', '#FFC876', '#5865F2'],
    });
  } else if (type === 'grand') {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#5865F2', '#FFC876', '#FF8FB1', '#57F287', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
};

export default function ConfettiBurst() {
  return null;
}
