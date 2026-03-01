'use client';
import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardEntrance } from '@/lib/animations';

type GlassLevel = 1 | 2 | 3;

interface GlassCardProps extends HTMLMotionProps<'div'> {
  level?: GlassLevel;
  animate?: boolean;
  className?: string;
}

const styles: Record<GlassLevel, React.CSSProperties> = {
  1: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
  },
  2: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.06) 100%)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '28px',
    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
  },
  3: {
    background: 'rgba(19,19,26,0.85)',
    backdropFilter: 'blur(60px) saturate(150%)',
    WebkitBackdropFilter: 'blur(60px) saturate(150%)',
    borderTop: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '32px 32px 0 0',
  },
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ level = 1, animate: shouldAnimate = false, className = '', style, children, ...props }, ref) => {
    const cardStyle = { ...styles[level], ...style };
    if (shouldAnimate) {
      return (
        <motion.div
          ref={ref}
          variants={cardEntrance}
          initial="hidden"
          animate="show"
          style={cardStyle}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      );
    }
    return (
      <motion.div ref={ref} style={cardStyle} className={className} {...props}>
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
