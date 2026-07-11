export const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1.0,
};

export const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const AUTO_SCROLL_DURATION = 2.0; // in seconds
