'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastVariants } from '@/lib/animations';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  variant?: 'success' | 'info' | 'warning';
}

const variantStyles = {
  success: {
    border: '0.5px solid rgba(48,209,88,0.30)',
    boxShadow: '0 0 0 0.5px rgba(48,209,88,0.10), 0 0 20px rgba(48,209,88,0.12), 0 8px 32px rgba(0,0,0,0.5)',
  },
  info: {
    border: '0.5px solid rgba(10,132,255,0.30)',
    boxShadow: '0 0 0 0.5px rgba(10,132,255,0.10), 0 0 20px rgba(10,132,255,0.12), 0 8px 32px rgba(0,0,0,0.5)',
  },
  warning: {
    border: '0.5px solid rgba(255,59,48,0.30)',
    boxShadow: '0 0 0 0.5px rgba(255,59,48,0.10), 0 0 20px rgba(255,59,48,0.12), 0 8px 32px rgba(0,0,0,0.5)',
  },
};

export function Toast({ message, visible, onHide, duration = 2500, variant = 'info' }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, onHide, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: 'fixed',
            top: `calc(env(safe-area-inset-top, 0px) + 16px)`,
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'fit-content',
            maxWidth: 'calc(min(430px, 100%) - 40px)',
            zIndex: 300,
            /* Glass pill */
            background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            borderRadius: 'var(--r-full)',
            padding: '12px 20px',
            color: 'var(--t1)',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            ...variantStyles[variant],
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
