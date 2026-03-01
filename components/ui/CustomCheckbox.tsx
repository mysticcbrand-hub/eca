'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: number;
}

export function CustomCheckbox({ checked, onChange, size = 28 }: CustomCheckboxProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-label={checked ? 'Desmarcar' : 'Marcar como completado'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: checked ? 'none' : '1.5px solid rgba(255,255,255,0.10)',
        background: checked
          ? 'linear-gradient(135deg, #2AB86A, #3DDB82)'
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: checked ? '0 0 12px rgba(61,219,130,0.3)' : 'none',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check size={size * 0.55} color="#fff" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
