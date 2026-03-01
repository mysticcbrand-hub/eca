'use client';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ value, size = 120, strokeWidth = 4 }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, value / 100));

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2AB86A" />
          <stop offset="40%" stopColor="#3DDB82" />
          <stop offset="70%" stopColor="#5DEBE8" />
          <stop offset="100%" stopColor="#4D9EFF" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(61,219,130,0.4))' }}
      />
    </svg>
  );
}
