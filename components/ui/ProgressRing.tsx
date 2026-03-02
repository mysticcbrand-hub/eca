'use client';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  gold?: boolean; // racha ≥ 7 días → anillo dorado
}

export function ProgressRing({ value, size = 120, strokeWidth = 4, gold = false }: ProgressRingProps) {
  const r     = (size - strokeWidth) / 2;
  const circ  = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, value / 100));
  const offset  = circ * (1 - clamped);

  // Tip dot position
  const angle  = (clamped * 360 - 90) * (Math.PI / 180);
  const tipX   = size / 2 + r * Math.cos(angle);
  const tipY   = size / 2 + r * Math.sin(angle);

  const gradId    = gold ? 'ringGradGold' : 'ringGradGreen';
  const glowColor = gold ? 'rgba(232,184,75,0.5)' : 'rgba(48,209,88,0.5)';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="ringGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1A9E45" />
          <stop offset="40%"  stopColor="#30D158" />
          <stop offset="70%"  stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
        <linearGradient id="ringGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#C9952E" />
          <stop offset="50%"  stopColor="#E8B84B" />
          <stop offset="100%" stopColor="#FFD60A" />
        </linearGradient>
        <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter="url(#ringGlow)"
      />

      {/* Tip dot — solo cuando hay progreso */}
      {clamped > 0.02 && (
        <motion.circle
          cx={tipX} cy={tipY} r={strokeWidth - 0.5}
          fill="white"
          filter="url(#ringGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
        />
      )}
    </svg>
  );
}
