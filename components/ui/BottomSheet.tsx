'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bottomSheetVariants, backdropVariants } from '@/lib/animations';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              /* glass-3 */
              background: 'linear-gradient(180deg, rgba(28,28,40,0.93) 0%, rgba(18,18,28,0.97) 100%)',
              backdropFilter: 'blur(72px) saturate(160%)',
              WebkitBackdropFilter: 'blur(72px) saturate(160%)',
              borderTop: '0.5px solid rgba(255,255,255,0.14)',
              borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 101,
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
              maxWidth: '430px',
              margin: '0 auto',
              width: '100%',
              /* Highlight borde superior */
            }}
          >
            {/* Pill indicador */}
            <div style={{
              width: 36, height: 4,
              borderRadius: 'var(--r-full)',
              background: 'rgba(255,255,255,0.15)',
              margin: '12px auto 0',
            }} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
