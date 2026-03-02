'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Layers, TrendingUp } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const tabs = [
  { href: '/',         label: 'HOY',      Icon: Flame      },
  { href: '/codigo',   label: 'REGLAS',   Icon: Shield     },
  { href: '/proyecto', label: 'PROYECTO', Icon: Layers     },
  { href: '/stats',    label: 'STATS',    Icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptics();

  if (pathname === '/onboarding') return null;

  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))',
        /* Glass nav — 4 capas */
        background: 'linear-gradient(180deg, rgba(9,9,14,0.75) 0%, rgba(6,6,10,0.92) 100%)',
        backdropFilter: 'blur(60px) saturate(200%)',
        WebkitBackdropFilter: 'blur(60px) saturate(200%)',
        borderTop: '0.5px solid rgba(255,255,255,0.09)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        zIndex: 200,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Línea de luz superior */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: '15%', right: '15%',
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 50%, transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 'var(--nav-height)',
          alignItems: 'center',
          padding: '0 8px',
        }}
      >
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => vibrate(8)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                height: '52px',
                position: 'relative',
                textDecoration: 'none',
                borderRadius: 'var(--r-lg)',
                padding: '0 4px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Pill de fondo animado — layoutId para deslizarse */}
              {isActive && (
                <motion.div
                  layoutId="tab-bg-pill"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  style={{
                    position: 'absolute',
                    inset: '4px 0',
                    borderRadius: 'var(--r-md)',
                    background: 'linear-gradient(145deg, rgba(48,209,88,0.14) 0%, rgba(48,209,88,0.07) 100%)',
                    border: '0.5px solid rgba(48,209,88,0.20)',
                  }}
                />
              )}

              {/* Ícono */}
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  y:     isActive ? -1   : 0,
                }}
                transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? 'var(--green)' : 'var(--t3)'}
                />
              </motion.div>

              {/* Label con AnimatePresence */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      color: 'var(--green)',
                      lineHeight: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
