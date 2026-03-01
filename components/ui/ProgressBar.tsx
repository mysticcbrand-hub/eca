'use client';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  height?: number;
  shimmer?: boolean;
}

export function ProgressBar({ value, height = 3, shimmer = true }: ProgressBarProps) {
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.1 }}
        style={{
          height: '100%',
          borderRadius: '9999px',
          background: shimmer && value < 100
            ? 'linear-gradient(90deg, #2AB86A 0%, #3DDB82 40%, #5DEBE8 70%, #4D9EFF 100%)'
            : 'linear-gradient(90deg, #2AB86A 0%, #3DDB82 100%)',
          backgroundSize: shimmer ? '200% auto' : 'auto',
        }}
        className={shimmer && value < 100 ? 'progress-shimmer' : ''}
      />
    </div>
  );
}
