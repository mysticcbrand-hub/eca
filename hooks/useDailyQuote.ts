'use client';
import { useMemo } from 'react';
import { getDailyQuote } from '@/lib/quotes';

export function useDailyQuote() {
  return useMemo(() => getDailyQuote(), []);
}
