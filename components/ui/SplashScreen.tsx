'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'blur' | 'logo' | 'tagline' | 'ready'>('blur');

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      setPhase('logo');
      
      await new Promise(r => setTimeout(r, 1200));
      setPhase('tagline');
      
      await new Promise(r => setTimeout(r, 1600));
      setPhase('ready');
      
      await new Promise(r => setTimeout(r, 600));
      setIsVisible(false);
      
      await new Promise(r => setTimeout(r, 400));
      onComplete();
    };
    
    sequence();
  }, [onComplete]);

  const containerVariants: Variants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.6, ease: customEase }
    }
  };

  const logoVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.85,
      filter: 'blur(20px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 1, 
        ease: customEase,
        scale: { duration: 1.2, ease: customEase }
      }
    }
  };

  const taglineVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 12,
      filter: 'blur(8px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8, 
        ease: customEase
      }
    }
  };

  const glowRingVariants: Variants = {
    initial: { 
      scale: 0.8, 
      opacity: 0 
    },
    animate: { 
      scale: 1.3, 
      opacity: 0.15,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  const progressVariants: Variants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 1,
      transition: { 
        duration: 2.5, 
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          variants={containerVariants}
          initial="initial"
          exit="exit"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#09090E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(48,209,88,0.12) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              variants={glowRingVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(48,209,88,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            <motion.svg
              variants={logoVariants}
              initial="hidden"
              animate={phase === 'logo' || phase === 'tagline' || phase === 'ready' ? 'visible' : 'hidden'}
              width="100"
              height="100"
              viewBox="0 0 1024 1024"
              style={{ 
                zIndex: 1,
                filter: 'drop-shadow(0 0 30px rgba(48,209,88,0.3))'
              }}
            >
              <defs>
                <linearGradient id="splash-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1AAE4F"/>
                  <stop offset="55%" stopColor="#30D158"/>
                  <stop offset="100%" stopColor="#0A84FF"/>
                </linearGradient>
                <linearGradient id="splash-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0A0A10"/>
                  <stop offset="100%" stopColor="#14141F"/>
                </linearGradient>
              </defs>
              
              <rect x="64" y="64" width="896" height="896" rx="220" fill="url(#splash-bg)"/>
              <path 
                fill="url(#splash-ring)" 
                fillRule="evenodd" 
                d="
                  M 512 248
                  A 264 264 0 1 1 511.99 248
                  Z
                  M 512 320
                  A 192 192 0 1 0 512.01 320
                  Z
                "
              />
            </motion.svg>
          </div>

          <motion.div
            variants={taglineVariants}
            initial="hidden"
            animate={phase === 'tagline' || phase === 'ready' ? 'visible' : 'hidden'}
            style={{
              marginTop: '32px',
              fontSize: '17px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.02em',
              fontFamily: '"DM Sans", sans-serif',
              textAlign: 'center',
            }}
          >
            Tu mente. Reclamada.
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              bottom: '48px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              variants={progressVariants}
              initial="initial"
              animate="animate"
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #30D158 0%, #0A84FF 100%)',
                borderRadius: '1px',
                transformOrigin: 'left',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'ready' ? 0.4 : 0 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '24px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: '"DM Mono", monospace',
              letterSpacing: '0.05em',
            }}
          >
            v1.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
