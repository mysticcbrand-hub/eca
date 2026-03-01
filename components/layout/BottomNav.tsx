'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, Layers, BarChart2 } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const tabs = [
  { href: '/',         label: 'HOY',      icon: Home },
  { href: '/codigo',   label: 'REGLAS',   icon: List },
  { href: '/proyecto', label: 'PROYECTO', icon: Layers },
  { href: '/stats',    label: 'STATS',    icon: BarChart2 },
];

export function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptics();

  // Don't show nav on onboarding
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
        background: 'rgba(8,8,12,0.88)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'flex-start',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 200,
      }}
    >
      {/* Tab row */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 'var(--nav-height)',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingInline: '4px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => vibrate(8)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                height: '64px',
                position: 'relative',
                textDecoration: 'none',
                borderRadius: '16px',
                transition: 'opacity 0.15s ease',
              }}
            >
              {/* Active pill bg */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                  style={{
                    position: 'absolute',
                    inset: '8px 6px',
                    background: 'linear-gradient(145deg, rgba(61,219,130,0.10) 0%, rgba(61,219,130,0.05) 100%)',
                    border: '1px solid rgba(61,219,130,0.14)',
                    borderRadius: '14px',
                  }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.08 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? '#EFEFF4' : '#34344A'}
                />
              </motion.div>

              {/* Label */}
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? '0.8px' : '0.4px',
                  color: isActive ? '#EFEFF4' : '#34344A',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.2s ease',
                }}
              >
                {tab.label}
              </span>

              {/* Active dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="dot"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute',
                      bottom: '7px',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: '#3DDB82',
                      boxShadow: '0 0 6px rgba(61,219,130,0.8)',
                    }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
