'use client';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useBadgeDetail } from '@/hooks/useBadgeDetail';
import { springs } from '@/lib/animations';
import type { Badge } from '@/lib/badges';
import {
  Flame, Zap, Shield, TrendingUp, Award, Star, Crown,
  RefreshCw, Sword, CheckSquare, Target, Layers,
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  Flame, Zap, Shield, TrendingUp, Award, Star, Crown,
  RefreshCw, Sword, CheckSquare, Target, Layers,
};

interface ContextualBadgePillProps {
  badge: Badge;
}

export function ContextualBadgePill({ badge }: ContextualBadgePillProps) {
  const { open } = useBadgeDetail();
  const Icon = ICONS[badge.icon] ?? Flame;

  const today        = new Date().toISOString().split('T')[0];
  const justUnlocked = badge.status === 'unlocked' && badge.unlockedAt?.startsWith(today);

  const label = badge.status === 'unlocked'
    ? badge.name
    : `${badge.name} · ${badge.currentValue}/${badge.requirement}`;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ ...springs.snappy, delay: 0.2 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => open(badge)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 12px 8px 10px',
        borderRadius: 'var(--r-full)',
        background: badge.accentColorDim,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `0.5px solid ${badge.accentColor.replace('0.5', '0.30').replace('0.6', '0.30').replace('0.7', '0.30')}`,
        cursor: 'pointer',
        maxWidth: 280,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer si recién desbloqueado */}
      {justUnlocked && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Ícono */}
      <motion.div
        animate={justUnlocked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 12 }}
      >
        <Icon size={14} color={badge.iconColor} strokeWidth={2} />
      </motion.div>

      {/* Label */}
      <span style={{
        fontSize: 12, fontWeight: 500,
        color: badge.status === 'unlocked' ? 'var(--t1)' : 'var(--t2)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>

      {/* Check si desbloqueado */}
      {badge.status === 'unlocked' && (
        <Check size={10} color="var(--green)" strokeWidth={3} />
      )}

      {/* Flecha */}
      <ChevronRight size={12} color="var(--t3)" strokeWidth={2} style={{ marginLeft: 1 }} />
    </motion.button>
  );
}
