'use client';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface PageWrapperProps {
  children: React.ReactNode;
  glowStyle?: string;
  /** 'neutral' | 'success' | 'relapse' | 'fire' */
  glowState?: 'neutral' | 'success' | 'relapse' | 'fire';
}

const glowMap: Record<string, string> = {
  neutral: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(10,132,255,0.04) 0%, transparent 70%)',
  success: 'radial-gradient(ellipse 120% 70% at 50% 0%, rgba(48,209,88,0.09) 0%, rgba(48,209,88,0.04) 40%, transparent 70%)',
  relapse: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,59,48,0.07) 0%, transparent 60%)',
  fire:    'radial-gradient(ellipse 120% 70% at 50% 0%, rgba(48,209,88,0.06) 0%, rgba(10,132,255,0.03) 50%, transparent 70%)',
};

export function PageWrapper({ children, glowStyle, glowState = 'neutral' }: PageWrapperProps) {
  const resolvedGlow = glowStyle ?? glowMap[glowState];

  return (
    <div style={{ position: 'relative', minHeight: '100%', background: 'var(--base)' }}>

      {/* CAPA 1 — base sólida (ya en body) */}

      {/* CAPA 2 — glow reactivo */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          height: '55%',
          background: resolvedGlow,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 2s ease, opacity 1.5s ease',
        }}
      />

      {/* CAPA 3 — noise texture (SVG turbulence) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.025,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Contenido de página */}
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
