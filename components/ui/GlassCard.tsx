'use client';
import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cardEntrance } from '@/lib/animations';

export type GlassLevel = 1 | 2 | 3;

interface GlassCardProps extends HTMLMotionProps<'div'> {
  level?: GlassLevel;
  animate?: boolean;
  className?: string;
}

const levelClass: Record<GlassLevel, string> = {
  1: 'glass-1',
  2: 'glass-2',
  3: 'glass-3',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ level = 1, animate: shouldAnimate = false, className = '', style, children, ...props }, ref) => {
    const cls = `${levelClass[level]} ${className}`.trim();

    if (shouldAnimate) {
      return (
        <motion.div
          ref={ref}
          variants={cardEntrance}
          initial="hidden"
          animate="show"
          className={cls}
          style={style}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div ref={ref} className={cls} style={style} {...props}>
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
