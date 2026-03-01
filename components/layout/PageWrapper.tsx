'use client';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface PageWrapperProps {
  children: React.ReactNode;
  glowStyle?: string;
  className?: string;
}

export function PageWrapper({ children, glowStyle, className = '' }: PageWrapperProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: '#0D0D12',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: glowStyle ?? 'radial-gradient(ellipse, rgba(61,219,130,0.06) 0%, rgba(61,219,130,0.02) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 1.5s ease',
        }}
      />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className={className}
        style={{ position: 'relative', zIndex: 1, maxWidth: '430px', margin: '0 auto' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
