'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BadgeDefinition } from '@/lib/badges';

interface BadgeToastProps {
  badge: BadgeDefinition | null;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const rarityGlow: Record<string, string> = {
  common:    'rgba(255,255,255,0.08)',
  rare:      'rgba(48,209,88,0.20)',
  epic:      'rgba(123,108,255,0.22)',
  legendary: 'rgba(232,184,75,0.28)',
};

const rarityBorder: Record<string, string> = {
  common:    'rgba(255,255,255,0.10)',
  rare:      'rgba(48,209,88,0.28)',
  epic:      'rgba(123,108,255,0.35)',
  legendary: 'rgba(232,184,75,0.40)',
};

const rarityLabel: Record<string, string> = {
  common:    'BADGE DESBLOQUEADO',
  rare:      'BADGE RARO',
  epic:      'BADGE ÉPICO',
  legendary: 'BADGE LEGENDARIO ✦',
};

const rarityColor: Record<string, string> = {
  common:    'var(--t2)',
  rare:      'var(--green-text)',
  epic:      '#7B6CFF',
  legendary: 'var(--gold-warm)',
};

export function BadgeToast({ badge, visible, onHide, duration = 3500 }: BadgeToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, onHide, duration]);

  const rarity = badge?.rarity ?? 'common';

  return (
    <AnimatePresence>
      {visible && badge && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: 10, scale: 0.95, filter: 'blur(2px)' }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          style={{
            position: 'fixed',
            bottom: `calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 14px)`,
            left: 0, right: 0,
            margin: '0 auto',
            width: 'min(380px, calc(100% - 32px))',
            zIndex: 999,
            /* Glass card real */
            background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.07) 100%)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            border: `0.5px solid ${rarityBorder[rarity]}`,
            borderTopColor: rarityBorder[rarity],
            borderRadius: 'var(--r-xl)',
            boxShadow: `0 0 0 1px ${rarityGlow[rarity]}, 0 0 24px ${rarityGlow[rarity]}, var(--shadow-card)`,
            padding: '16px 18px',
          }}
        >
          {/* Shine line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '0.5px',
            background: `linear-gradient(90deg, transparent, ${rarityBorder[rarity]} 50%, transparent)`,
            borderRadius: 'var(--r-full)',
          }} />

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {/* Ícono */}
            <div style={{
              width: 46, height: 46, borderRadius: 'var(--r-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `rgba(255,255,255,0.06)`,
              border: `0.5px solid ${rarityBorder[rarity]}`,
              fontSize: '20px', flexShrink: 0,
              boxShadow: `0 0 12px ${rarityGlow[rarity]}`,
            }}>
              {badge.icon}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: rarityColor[rarity], marginBottom: '4px',
              }}>
                {rarityLabel[rarity]}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.02em' }}>
                {badge.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px', lineHeight: 1.4 }}>
                {badge.description}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
