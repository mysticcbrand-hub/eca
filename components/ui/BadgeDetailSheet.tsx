'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Zap, Shield, TrendingUp, Award, Star, Crown,
  RefreshCw, Sword, CheckSquare, Target, Layers, Lock,
  Check,
} from 'lucide-react';
import { useBadgeDetail } from '@/hooks/useBadgeDetail';
import { backdropVariants, springs } from '@/lib/animations';
import type { Badge } from '@/lib/badges';

/* ── Lucide icon resolver ─────────────────── */
const ICONS: Record<string, React.ElementType> = {
  Flame, Zap, Shield, TrendingUp, Award, Star, Crown,
  RefreshCw, Sword, CheckSquare, Target, Layers,
};

function BadgeIcon({ name, size, color, opacity = 1 }: { name: string; size: number; color: string; opacity?: number }) {
  const Icon = ICONS[name] ?? Flame;
  return <Icon size={size} color={color} strokeWidth={1.8} style={{ opacity }} />;
}

/* ── Category labels ─── */
const CATEGORY_LABELS: Record<string, string> = {
  streak: 'RACHA', resilience: 'RESILIENCIA',
  project: 'PROYECTO', code: 'CÓDIGO', legendary: 'LEGENDARIA',
};

/* ── Status pill ─────── */
function StatusPill({ status, accentColor, accentColorDim }: { status: Badge['status']; accentColor: string; accentColorDim: string }) {
  const configs = {
    unlocked:    { bg: 'rgba(48,209,88,0.12)', border: 'rgba(48,209,88,0.30)', color: '#30D158', label: '✓ DESBLOQUEADA' },
    in_progress: { bg: 'rgba(10,132,255,0.10)', border: 'rgba(10,132,255,0.28)', color: '#0A84FF', label: 'EN PROGRESO' },
    locked:      { bg: accentColorDim, border: accentColor.replace('0.5', '0.15'), color: 'var(--t3)', label: 'BLOQUEADA' },
  };
  const c = configs[status];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 12px', borderRadius: 'var(--r-full)',
      background: c.bg, border: `0.5px solid ${c.border}`,
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
      color: c.color,
    }}>
      {c.label}
    </div>
  );
}

/* ── Progress bar ────── */
function ProgressBar({ badge }: { badge: Badge }) {
  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: badge.iconColor }}>
          {badge.currentValue}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
          {Math.round(badge.progress * 100)}% completado
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t3)' }}>
          {badge.requirement}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 6, borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.06)' }}>
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${badge.progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            borderRadius: 'var(--r-full)',
            background: `linear-gradient(90deg, ${badge.iconColor} 0%, ${badge.accentColor} 100%)`,
          }}
        />
        {/* Tip dot */}
        {badge.progress > 0.02 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
              left: `${badge.progress * 100}%`,
              width: 10, height: 10, borderRadius: '50%',
              background: badge.iconColor,
              boxShadow: `0 0 8px ${badge.accentColor}`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export function BadgeDetailSheet() {
  const { activeBadge: badge, close } = useBadgeDetail();

  useEffect(() => {
    if (badge) document.body.style.overflow = 'hidden';
    else       document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [badge]);

  const isUnlocked    = badge?.status === 'unlocked';
  const isInProgress  = badge?.status === 'in_progress';
  const isLocked      = badge?.status === 'locked';
  const today         = new Date().toISOString().split('T')[0];
  const justUnlocked  = badge?.unlockedAt?.startsWith(today) && isUnlocked;

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()}`;
  };

  return (
    <AnimatePresence>
      {badge && (
        <>
          {/* Backdrop */}
          <motion.div
            key="badge-backdrop"
            variants={backdropVariants}
            initial="hidden" animate="show" exit="exit"
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.70)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              zIndex: 500,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="badge-sheet"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={springs.gentle}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              maxWidth: 430, margin: '0 auto',
              /* Glass-3 + tint del badge */
              background: `
                radial-gradient(ellipse 80% 40% at 50% 0%, ${badge.accentColorDim.replace('0.08','0.16')} 0%, transparent 60%),
                linear-gradient(180deg, rgba(28,28,40,0.96) 0%, rgba(14,14,22,0.99) 100%)
              `,
              backdropFilter: 'blur(72px) saturate(160%)',
              WebkitBackdropFilter: 'blur(72px) saturate(160%)',
              borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0',
              borderTop: `0.5px solid ${badge.accentColor.replace('0.5','0.18')}`,
              boxShadow: 'var(--shadow-modal)',
              zIndex: 501,
              paddingBottom: 'env(safe-area-inset-bottom, 24px)',
              overflowY: 'auto',
              maxHeight: '82dvh',
            }}
          >
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.12)', margin: '12px auto 0' }} />

            {/* ── Hero ícono ─────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 0' }}>
              <div style={{ position: 'relative', width: 88, height: 88 }}>
                {/* Glow ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...springs.bouncy, delay: 0.15 }}
                  style={{
                    position: 'absolute', inset: -12,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${badge.accentColorDim.replace('0.08','0.20')} 0%, transparent 70%)`,
                    animation: isUnlocked ? 'pulseRing 3s ease infinite' : 'none',
                  }}
                />

                {/* Circle */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...springs.bouncy, delay: 0.25 }}
                  style={{
                    width: 88, height: 88, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${badge.accentColorDim} 0%, rgba(255,255,255,0.04) 100%)`
                      : isInProgress
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.03)',
                    border: isUnlocked
                      ? `1px solid ${badge.accentColor.replace('0.5','0.40')}`
                      : isInProgress
                      ? '1px solid rgba(255,255,255,0.10)'
                      : '1px dashed rgba(255,255,255,0.06)',
                    boxShadow: isUnlocked
                      ? `0 0 0 1px ${badge.accentColor.replace('0.5','0.10')}, 0 0 28px ${badge.accentColor.replace('0.5','0.18')}`
                      : 'none',
                  }}
                >
                  <BadgeIcon
                    name={badge.icon}
                    size={isLocked ? 30 : 36}
                    color={isLocked ? 'var(--t4)' : badge.iconColor}
                    opacity={isInProgress ? 0.6 : 1}
                  />

                  {/* Lock overlay */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute', bottom: -4, right: -4,
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'var(--elevated)',
                      border: '0.5px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Lock size={10} color="var(--t4)" strokeWidth={2} />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Category label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ marginTop: 16 }}
              >
                <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '2.5px' }}>
                  {CATEGORY_LABELS[badge.category] ?? badge.category.toUpperCase()}
                </span>
              </motion.div>

              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ marginTop: 10 }}
              >
                <StatusPill status={badge.status} accentColor={badge.accentColor} accentColorDim={badge.accentColorDim} />
              </motion.div>

              {/* Name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  marginTop: 16, textAlign: 'center',
                  fontSize: 'clamp(22px,6vw,28px)', fontWeight: 700, letterSpacing: '-0.03em',
                  color: isUnlocked ? badge.iconColor : 'var(--t1)',
                  lineHeight: 1.1,
                }}
              >
                {badge.name}
              </motion.h2>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: 14, color: 'var(--t3)', fontStyle: 'italic', marginTop: 6, textAlign: 'center' }}
              >
                {badge.tagline}
              </motion.p>

              {/* Divider */}
              <div className="divider" style={{ width: '100%', margin: '20px 0' }} />
            </div>

            {/* ── Descripción ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ padding: '0 24px' }}
            >
              <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '2px' }}>
                SOBRE ESTA INSIGNIA
              </span>
              <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.75, marginTop: 10 }}>
                {badge.description}
              </p>
            </motion.div>

            {/* ── Progreso / Desbloqueada ──────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              style={{ padding: '20px 24px 0' }}
            >
              {isUnlocked ? (
                /* Fecha de desbloqueo */
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 'var(--r-lg)',
                  background: 'rgba(48,209,88,0.06)', border: '0.5px solid rgba(48,209,88,0.18)',
                }}>
                  <Check size={14} color="var(--green)" strokeWidth={2.5} />
                  <span style={{ fontSize: 13, color: 'var(--t2)' }}>
                    {badge.unlockedAt
                      ? `Desbloqueada el ${formatDate(badge.unlockedAt)}`
                      : 'Insignia desbloqueada'}
                  </span>
                </div>
              ) : (
                /* Cómo conseguirla + progreso */
                <div className="glass-1" style={{ padding: '16px 18px', borderRadius: 'var(--r-lg)' }}>
                  <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '2px' }}>
                    CÓMO CONSEGUIRLA
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.6, marginTop: 8 }}>
                    {badge.howToEarn}
                  </p>

                  {isInProgress && (
                    <>
                      <div className="divider" style={{ margin: '14px 0' }} />
                      <ProgressBar badge={badge} />
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* ── CTA de cierre ───────────────────── */}
            <div style={{ padding: '24px 24px 8px' }}>
              <button
                onClick={close}
                style={{
                  width: '100%', height: 50, borderRadius: 'var(--r-full)',
                  background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--border-subtle)',
                  color: 'var(--t3)', fontSize: 14, cursor: 'pointer',
                  fontFamily: 'var(--font)',
                }}
              >
                Cerrar
              </button>
            </div>

            {/* ── Partículas si recién desbloqueado ─ */}
            {justUnlocked && <UnlockParticles color={badge.iconColor} />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Unlock particles (canvas) ─────────────── */
function UnlockParticles({ color }: { color: string }) {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:600;width:100%;height:100%';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.38;

    const particles = Array.from({ length: 10 }, (_, i) => ({
      x: cx, y: cy,
      angle: (-90 + (i - 5) * 22) * (Math.PI / 180),
      speed: 2.5 + Math.random() * 2,
      size:  4 + Math.random() * 4,
      alpha: 1,
      vy:    -(2 + Math.random() * 2),
    }));

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x    += Math.cos(p.angle) * p.speed;
        p.y    += p.vy;
        p.vy   += 0.06;
        p.alpha = Math.max(0, 1 - frame / 70);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      frame++;
      if (frame < 80) requestAnimationFrame(tick);
      else canvas.remove();
    };

    const t = setTimeout(() => requestAnimationFrame(tick), 700);
    return () => { clearTimeout(t); canvas.remove(); };
  }, [color]);

  return null;
}
