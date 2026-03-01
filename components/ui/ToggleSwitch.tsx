'use client';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 26,
        borderRadius: 9999,
        background: checked
          ? 'linear-gradient(135deg, #2AB86A, #3DDB82)'
          : '#1C1C26',
        border: checked ? '1px solid rgba(61,219,130,0.4)' : '1px solid rgba(255,255,255,0.10)',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background 0.2s ease, border 0.2s ease',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#EFEFF4',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}
