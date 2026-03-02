// Typed localStorage getters/setters for ECA

export interface Relapse {
  date: string;
  days_reached: number;
  trigger: string;
}

export interface Rule {
  id: string;
  text: string;
  enabled: boolean;
  custom: boolean;
}

export interface Victory {
  date: string;
  text: string;
}

export interface HistoryEntry {
  date: string;
  completed: boolean;
  streak: number;
  /** @deprecated use completed instead */
  status?: 'done' | 'relapse';
}

function get(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}
function set(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}
function getJSON<T>(key: string, fallback: T): T {
  try {
    const v = get(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function setJSON<T>(key: string, value: T): void {
  set(key, JSON.stringify(value));
}

function listEcaKeys(): string[] {
  if (typeof window === 'undefined') return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('eca_')) keys.push(key);
  }
  return keys;
}

// --- ECA Core ---
export const storage = {
  isOnboarded: () => get('eca_onboarded') === 'true',
  setOnboarded: () => set('eca_onboarded', 'true'),

  getStartDate: () => get('eca_start_date'),
  setStartDate: (d: string) => set('eca_start_date', d),

  getStreak: () => parseInt(get('eca_streak') ?? '0', 10),
  setStreak: (n: number) => set('eca_streak', String(n)),

  getBestStreak: () => parseInt(get('eca_best_streak') ?? '0', 10),
  setBestStreak: (n: number) => set('eca_best_streak', String(n)),

  getTotalDays: () => parseInt(get('eca_total_days') ?? '0', 10),
  setTotalDays: (n: number) => set('eca_total_days', String(n)),

  getLastCheckin: () => get('eca_last_checkin'),
  setLastCheckin: (d: string | null) => {
    if (d === null) localStorage.removeItem('eca_last_checkin');
    else set('eca_last_checkin', d);
  },

  getRelapses: () => getJSON<Relapse[]>('eca_relapses', []),
  setRelapses: (r: Relapse[]) => setJSON('eca_relapses', r),
  addRelapse: (r: Relapse) => {
    const arr = storage.getRelapses();
    arr.push(r);
    storage.setRelapses(arr);
  },

  getTargets: () => getJSON<string[]>('eca_targets', []),
  setTargets: (t: string[]) => setJSON('eca_targets', t),

  getRules: () => getJSON<Rule[]>('eca_rules', []),
  setRules: (r: Rule[]) => setJSON('eca_rules', r),

  getProjectMain: () => get('eca_project_main') ?? '',
  setProjectMain: (s: string) => set('eca_project_main', s),

  // Aliases for proyecto/page.tsx
  getProject: () => get('eca_project_main') ?? '',
  setProject: (s: string) => set('eca_project_main', s),

  getVictories: () => getJSON<Victory[]>('eca_victories', []),
  setVictories: (v: Victory[]) => setJSON('eca_victories', v),
  addVictory: (v: Victory) => {
    const arr = storage.getVictories();
    arr.unshift(v);
    storage.setVictories(arr);
  },

  getDailyGoal: (date: string) => getJSON<{ text: string; done: boolean } | null>(`eca_daily_goal_${date}`, null),
  setDailyGoal: (date: string, goal: { text: string; done: boolean }) => setJSON(`eca_daily_goal_${date}`, goal),

  getChecks: (date: string) => getJSON<Record<string, boolean>>(`eca_checks_${date}`, {}),
  setChecks: (date: string, checks: Record<string, boolean>) => setJSON(`eca_checks_${date}`, checks),

  getHistory: () => getJSON<HistoryEntry[]>('eca_history', []),

  getBadgesUnlocked: () => getJSON<string[]>('eca_badges_unlocked', []),
  setBadgesUnlocked: (ids: string[]) => setJSON('eca_badges_unlocked', ids),
  hasBadgesUnlocked: () => (typeof window !== 'undefined' ? localStorage.getItem('eca_badges_unlocked') !== null : false),
  setHistory: (h: HistoryEntry[]) => setJSON('eca_history', h),
  addHistory: (entry: HistoryEntry) => {
    const arr = storage.getHistory();
    // Replace if same date
    const idx = arr.findIndex(e => e.date === entry.date);
    if (idx >= 0) arr[idx] = entry;
    else arr.push(entry);
    storage.setHistory(arr);
  },

  exportData: () => {
    const keys = listEcaKeys();
    const data: Record<string, string> = {};
    keys.forEach(key => {
      const value = get(key);
      if (value !== null) data[key] = value;
    });
    return data;
  },
  importData: (data: Record<string, string>) => {
    if (typeof window === 'undefined') return;
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('eca_')) set(key, value);
    });
  },
  clearAll: () => {
    if (typeof window === 'undefined') return;
    listEcaKeys().forEach(key => localStorage.removeItem(key));
  },
};

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
