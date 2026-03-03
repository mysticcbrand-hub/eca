'use client';
import { createContext, useContext, useState, useCallback, type ReactNode, createElement } from 'react';
import type { Badge } from '@/lib/badges';

interface BadgeDetailStore {
  activeBadge: Badge | null;
  open:  (badge: Badge) => void;
  close: () => void;
}

const BadgeDetailContext = createContext<BadgeDetailStore>({
  activeBadge: null,
  open:  () => {},
  close: () => {},
});

export function BadgeDetailProvider({ children }: { children: ReactNode }) {
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const open  = useCallback((badge: Badge) => setActiveBadge(badge), []);
  const close = useCallback(() => setActiveBadge(null), []);

  return createElement(
    BadgeDetailContext.Provider,
    { value: { activeBadge, open, close } },
    children
  );
}

export function useBadgeDetail(): BadgeDetailStore {
  return useContext(BadgeDetailContext);
}
