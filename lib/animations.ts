import type { Variants, Transition } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   SPRINGS — física real, no ease lineal
   Usar para cualquier cosa que el usuario toque.
═══════════════════════════════════════════════════ */
export const springs = {
  /** Elementos que el usuario toca directamente */
  snappy:  { type: 'spring', stiffness: 600, damping: 35 } as Transition,
  /** Cards y transiciones de pantalla */
  medium:  { type: 'spring', stiffness: 350, damping: 30 } as Transition,
  /** Modales y elementos grandes */
  gentle:  { type: 'spring', stiffness: 200, damping: 28 } as Transition,
  /** Número hero, badges — tiene masa */
  bouncy:  { type: 'spring', stiffness: 400, damping: 20, mass: 1.2 } as Transition,
};

/* ═══════════════════════════════════════════════════
   EASE — solo para animaciones ambientales
═══════════════════════════════════════════════════ */
export const ease = {
  ios:   [0.25, 0.46, 0.45, 0.94] as [number,number,number,number],
  enter: [0.16, 1,    0.3,  1   ] as [number,number,number,number],
  exit:  [0.4,  0,    1,    1   ] as [number,number,number,number],
};

/* ─── Backwards‑compatible aliases ──────────────── */
export const spring: Transition        = springs.snappy;
export const springMedium: Transition  = springs.medium;
export const easeCustom: Transition    = { duration: 0.35, ease: ease.enter };

/* ═══════════════════════════════════════════════════
   VARIANTS
═══════════════════════════════════════════════════ */

/** Entrada de página completa */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: easeCustom },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.3 } },
};

/** Stagger de cards en lista */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Card individual con entrada */
export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: springs.medium },
};

/** Item de lista (reglas, victorias) */
export const listItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0,   transition: springs.medium },
  exit:   { opacity: 0, x: 12, scale: 0.95, transition: { duration: 0.18 } },
};

/** Bottom Sheet modal */
export const bottomSheetVariants: Variants = {
  hidden: { y: '100%', opacity: 0.5 },
  show:   { y: 0,      opacity: 1,   transition: springs.gentle },
  exit:   { y: '100%', opacity: 0,   transition: { duration: 0.25, ease: ease.exit } },
};

/** Backdrop modal */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.25 } },
  exit:   { opacity: 0, transition: { duration: 0.2  } },
};

/** Badge de logro — entra con bounce */
export const badgeVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0, y: -8 },
  show:   {
    scale: [1.1, 0.95, 1.03, 1], opacity: 1, y: 0,
    transition: { ...springs.bouncy, delay: 0.3 },
  },
};

/** Toast */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9,  filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)', transition: springs.snappy },
  exit:   { opacity: 0, y: -8, scale: 0.95, filter: 'blur(2px)', transition: { duration: 0.18 } },
};

/** Checkmark SVG */
export const checkmarkVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show:   { scale: [0, 1.3, 1], opacity: 1, transition: springs.bouncy },
};

/** Scale in genérico */
export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show:   { scale: 1, opacity: 1, transition: springs.snappy },
};

/** Número hero — animación al incrementar */
export const heroNumberVariants: Variants = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1,    opacity: 1, transition: springs.bouncy },
  exit:    { scale: 1.1,  opacity: 0, transition: { duration: 0.15 } },
};

/** Flip de número */
export const numberFlip: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0,  opacity: 1, transition: springs.medium },
  exit:    { rotateX: -90,opacity: 0, transition: { duration: 0.2 } },
};
