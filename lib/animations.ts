import type { Variants, Transition } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 400, damping: 30 };
export const springMedium: Transition = { type: 'spring', stiffness: 250, damping: 25 };
export const easeCustom: Transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: easeCustom },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springMedium,
  },
};

export const bottomSheetVariants: Variants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { type: 'spring', stiffness: 350, damping: 35 } },
  exit: { y: '100%', transition: { duration: 0.25, ease: 'easeIn' } },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: spring },
};

export const numberFlip: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1, transition: springMedium },
  exit: { rotateX: -90, opacity: 0, transition: { duration: 0.2 } },
};
