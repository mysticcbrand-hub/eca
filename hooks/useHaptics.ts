'use client';
import { useCallback } from 'react';

export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[] = 8) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { vibrate };
}
