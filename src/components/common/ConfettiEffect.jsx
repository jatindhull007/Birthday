import confetti from 'canvas-confetti';
import { sound } from '../../services/soundService';

export const triggerConfetti = (mode = 'celebration') => {
  sound.playFanfare();

  if (mode === 'cyber') {
    // Electric purple / neon cyan / emerald
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#ffffff'],
      disableForReducedMotion: true
    });
  } else if (mode === 'burst') {
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });
  } else {
    // Grand Finale Gold & Multicolor Explosion
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#dfa84b', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#10b981', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
};
