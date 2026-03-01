'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, visible, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, duration);
      return () => clearTimeout(t);
    }
  }, [visible, onHide, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'fit-content',
            maxWidth: 'calc(430px - 40px)',
            zIndex: 200,
            background: 'rgba(28,28,38,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '9999px',
            padding: '12px 24px',
            color: '#EFEFF4',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
