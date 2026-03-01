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
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 100,
            }}
          />
          <motion.div
            key="sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'rgba(19,19,26,0.92)',
              backdropFilter: 'blur(60px) saturate(150%)',
              WebkitBackdropFilter: 'blur(60px) saturate(150%)',
              borderTop: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '32px 32px 0 0',
              zIndex: 101,
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
              maxWidth: '430px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
