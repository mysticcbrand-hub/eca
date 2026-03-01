'use client';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface PageWrapperProps {
  children: React.ReactNode;
  glowStyle?: string;
}

export function PageWrapper({ children, glowStyle }: PageWrapperProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Ambient glow — fixed within shell */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-180px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '560px',
          height: '380px',
          background: glowStyle ?? 'radial-gradient(ellipse, rgba(61,219,130,0.07) 0%, rgba(61,219,130,0.025) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 1.8s ease',
        }}
      />

      {/* Page content */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
