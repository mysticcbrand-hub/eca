'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, List, Layers, BarChart2 } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const tabs = [
  { href: '/', label: 'HOY', icon: Home },
  { href: '/codigo', label: 'CÓDIGO', icon: List },
  { href: '/proyecto', label: 'PROYECTO', icon: Layers },
  { href: '/stats', label: 'STATS', icon: BarChart2 },
];

export function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptics();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '0px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '56px',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingInline: '8px',
          position: 'relative',
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
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                position: 'relative',
                height: '56px',
                textDecoration: 'none',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: 'absolute',
                    inset: '6px 4px',
                    background: 'rgba(61,219,130,0.08)',
                    border: '1px solid rgba(61,219,130,0.12)',
                    borderRadius: '9999px',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                color={isActive ? '#EFEFF4' : '#262636'}
                style={{ position: 'relative', zIndex: 1 }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: isActive ? '#EFEFF4' : '#262636',
                  letterSpacing: '0.5px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#3DDB82',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
