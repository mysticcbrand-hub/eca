'use client';
import { useState, useCallback } from 'react';

type GlowState = 'neutral' | 'success' | 'relapse';

export function useAmbientGlow() {
  const [glowState, setGlowState] = useState<GlowState>('neutral');

  const triggerSuccess = useCallback(() => {
    setGlowState('success');
    setTimeout(() => setGlowState('neutral'), 3000);
  }, []);

  const triggerRelapse = useCallback(() => {
    setGlowState('relapse');
    setTimeout(() => setGlowState('neutral'), 2000);
  }, []);

  const glowStyle = {
    neutral: 'radial-gradient(ellipse, rgba(61,219,130,0.06) 0%, rgba(61,219,130,0.02) 40%, transparent 70%)',
    success: 'radial-gradient(ellipse, rgba(61,219,130,0.12) 0%, rgba(61,219,130,0.04) 40%, transparent 70%)',
    relapse: 'radial-gradient(ellipse, rgba(255,77,77,0.08) 0%, rgba(255,77,77,0.02) 40%, transparent 70%)',
  }[glowState];

  return { glowState, glowStyle, triggerSuccess, triggerRelapse };
}
