export const easing = {
  standard: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
  emphasis: [0.22, 1, 0.36, 1],
} as const;

export const durations = {
  instant: 0.1,
  hover: 0.14,
  menu: 0.18,
  modal: 0.24,
  page: 0.28,
  chart: 0.55,
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: durations.page, ease: easing.standard },
} as const;
