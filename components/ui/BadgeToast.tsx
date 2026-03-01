'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeDefinition } from '@/lib/badges';

interface BadgeToastProps {
  badge: BadgeDefinition | null;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function BadgeToast({ badge, visible, onHide, duration = 3200 }: BadgeToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, duration);
      return () => clearTimeout(t);
    }
  }, [visible, onHide, duration]);

  return (
    <AnimatePresence>
      {visible && badge && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 12px)',
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'min(380px, calc(100% - 32px))',
            maxWidth: '430px',
            zIndex: 999,
            background: 'rgba(19,19,26,0.88)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontSize: '18px', fontWeight: 700,
            }}>
              {badge.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#3DDB82', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Badge desbloqueado
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#EFEFF4' }}>{badge.name}</div>
              <div style={{ fontSize: '12px', color: '#7A7A8C', marginTop: '2px' }}>{badge.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
