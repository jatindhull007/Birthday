export const TIMING = {
  micro: 0.18,        // button hover/tap
  panel: 0.5,          // card/panel enter, spring stiffness 120 damping 14
  actTransition: 0.7,  // full-screen transitions between steps
  wordStagger: 0.06,   // per-word text reveal stagger
  revealLineHold: 1500, // ms — Step 6 line-by-line hold, in ms not seconds
};

export const fadeSlideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: TIMING.panel, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: TIMING.micro } }
};

export const actTransitionVariant = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: TIMING.actTransition, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: TIMING.panel, ease: [0.7, 0, 0.84, 0] } }
};
