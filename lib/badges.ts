// REGLA ECA — BADGES
// La lógica de badges SOLO existe en /lib/badges.ts
// Los badges se muestran en EXACTAMENTE 2 lugares:
//   1. /app/page.tsx → ContextualBadgePill (máx 1 badge)
//   2. /app/stats/page.tsx → BadgeGallery (todos los badges)
// El sheet de detalle se renderiza en layout.tsx (singleton)
// Si necesitas mostrar un badge en otro lugar:
//   → Abre BadgeDetailSheet con useBadgeDetail().open(badge)
//   → NO renderices un nuevo componente de badge

export type BadgeStatus   = 'locked' | 'in_progress' | 'unlocked';
export type BadgeRarity   = 'common' | 'rare' | 'epic' | 'legendary'; // kept for legacy
export type BadgeCategory = 'streak' | 'resilience' | 'project' | 'code' | 'legendary';

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  /** @deprecated use category */
  rarity?: BadgeRarity;

  // Visual
  icon: string;        // Lucide icon name
  iconColor: string;
  accentColor: string;
  accentColorDim: string;

  // Content
  name: string;
  tagline: string;
  description: string;
  howToEarn: string;

  // Logic
  requirement: number;
  metric:
    | 'streak'
    | 'total_days'
    | 'best_streak'
    | 'rules_completed_today'
    | 'victories'
    | 'comeback_streak';

  contextPriority: number;
}

export interface Badge extends BadgeDefinition {
  status: BadgeStatus;
  progress: number;     // 0.0 → 1.0
  currentValue: number;
  unlockedAt?: string;  // ISO date
}

export interface UserStats {
  streak: number;
  bestStreak: number;
  totalDays: number;
  relapses: { date: string; days_reached: number; trigger: string }[];
  victories: { date: string; text: string }[];
  rules: { id: string; text: string; enabled: boolean }[];
  checks: Record<string, boolean>;
  isComeback: boolean;
  comebackStreak: number;
  unlockedBadgeHistory: Record<string, string>; // { badgeId: ISOdate }
}

/* ═══════════════════════════════════════════════════
   BADGE DEFINITIONS — única fuente de verdad
═══════════════════════════════════════════════════ */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [

  // ── STREAK ──────────────────────────────────────

  {
    id: 'first_day',
    category: 'streak',
    rarity: 'common',
    icon: 'Flame',
    iconColor: '#FF9F0A',
    accentColor: 'rgba(255,159,10,0.5)',
    accentColorDim: 'rgba(255,159,10,0.08)',
    name: 'Primer Fuego',
    tagline: 'El día que todo cambia.',
    description: 'Completaste tu primer día. No suena a mucho, pero la mayoría no llega aquí. Este es el momento en que dejas de hablar y empiezas a hacer.',
    howToEarn: 'Marca tu primer día como completado.',
    requirement: 1,
    metric: 'streak',
    contextPriority: 10,
  },
  {
    id: 'three_days',
    category: 'streak',
    rarity: 'common',
    icon: 'Zap',
    iconColor: '#30D158',
    accentColor: 'rgba(48,209,88,0.5)',
    accentColorDim: 'rgba(48,209,88,0.08)',
    name: 'Impulso',
    tagline: '3 días es donde empieza el hábito.',
    description: 'Los primeros 3 días son los más difíciles. Tu cerebro busca el camino fácil. Tú elegiste el difícil tres veces seguidas. Eso ya es diferente.',
    howToEarn: 'Mantén una racha de 3 días consecutivos.',
    requirement: 3,
    metric: 'streak',
    contextPriority: 20,
  },
  {
    id: 'one_week',
    category: 'streak',
    rarity: 'rare',
    icon: 'Shield',
    iconColor: '#30D158',
    accentColor: 'rgba(48,209,88,0.6)',
    accentColorDim: 'rgba(48,209,88,0.10)',
    name: 'Primera Semana',
    tagline: '7 días de decisiones correctas.',
    description: 'Una semana completa. Tu sistema nervioso ya empieza a reescribirse. Los impulsos siguen ahí, pero tu respuesta a ellos cambió. Esto es reconstrucción real.',
    howToEarn: 'Alcanza una racha de 7 días consecutivos.',
    requirement: 7,
    metric: 'streak',
    contextPriority: 30,
  },
  {
    id: 'two_weeks',
    category: 'streak',
    rarity: 'rare',
    icon: 'TrendingUp',
    iconColor: '#0A84FF',
    accentColor: 'rgba(10,132,255,0.5)',
    accentColorDim: 'rgba(10,132,255,0.08)',
    name: 'Momentum',
    tagline: '14 días. Ya es un patrón.',
    description: 'Dos semanas seguidas. Lo que antes te parecía imposible ahora es tu rutina. Tu identidad está cambiando, aunque todavía no lo notes del todo.',
    howToEarn: 'Alcanza una racha de 14 días consecutivos.',
    requirement: 14,
    metric: 'streak',
    contextPriority: 40,
  },
  {
    id: 'one_month',
    category: 'streak',
    rarity: 'epic',
    icon: 'Award',
    iconColor: '#E8B84B',
    accentColor: 'rgba(232,184,75,0.6)',
    accentColorDim: 'rgba(232,184,75,0.10)',
    name: 'Un Mes',
    tagline: '30 días. Eres otro.',
    description: 'Treinta días consecutivos. La neurociencia dice que un hábito se forma entre 21 y 66 días. Tú ya cruzaste la primera barrera. El sistema operativo de tu cerebro se actualizó.',
    howToEarn: 'Mantén una racha de 30 días consecutivos.',
    requirement: 30,
    metric: 'streak',
    contextPriority: 50,
  },
  {
    id: 'fifty_days',
    category: 'streak',
    rarity: 'epic',
    icon: 'Star',
    iconColor: '#E8B84B',
    accentColor: 'rgba(232,184,75,0.7)',
    accentColorDim: 'rgba(232,184,75,0.12)',
    name: 'La Mitad del Camino',
    tagline: '50 días de construcción pura.',
    description: 'Cincuenta días. Este número no lo alcanza casi nadie. A estas alturas no estás peleando contra el impulso, estás construyendo algo que importa. La disciplina se volvió identidad.',
    howToEarn: 'Alcanza una racha de 50 días consecutivos.',
    requirement: 50,
    metric: 'streak',
    contextPriority: 60,
  },
  {
    id: 'one_hundred',
    category: 'legendary',
    rarity: 'legendary',
    icon: 'Crown',
    iconColor: '#FFD60A',
    accentColor: 'rgba(255,214,10,0.7)',
    accentColorDim: 'rgba(255,214,10,0.12)',
    name: 'Centurión',
    tagline: '100 días. Leyenda.',
    description: 'Cien días. Esto no es una racha, es una transformación. El 99% de las personas que descargaron esta app no llegaron aquí. Tú sí. Esta insignia no se explica. Se muestra.',
    howToEarn: 'Alcanza una racha de 100 días consecutivos.',
    requirement: 100,
    metric: 'streak',
    contextPriority: 100,
  },

  // ── RESILIENCE ───────────────────────────────────

  {
    id: 'comeback',
    category: 'resilience',
    rarity: 'rare',
    icon: 'RefreshCw',
    iconColor: '#FF6B6B',
    accentColor: 'rgba(255,107,107,0.5)',
    accentColorDim: 'rgba(255,107,107,0.08)',
    name: 'El Regreso',
    tagline: 'Caíste y volviste igual.',
    description: 'Después de una recaída, volviste y llegaste a 3 días de nuevo. Eso no es debilidad, es la única forma real de construir resiliencia. Los que nunca caen no saben levantarse.',
    howToEarn: 'Después de una recaída, alcanza una racha de 3 días.',
    requirement: 3,
    metric: 'comeback_streak',
    contextPriority: 25,
  },
  {
    id: 'iron_comeback',
    category: 'resilience',
    rarity: 'epic',
    icon: 'Sword',
    iconColor: '#E8B84B',
    accentColor: 'rgba(232,184,75,0.5)',
    accentColorDim: 'rgba(232,184,75,0.08)',
    name: 'Acero',
    tagline: 'Roto y reconstruido.',
    description: 'Tuviste una recaída y después de ella alcanzaste 7 días seguidos. Eso requiere un nivel de autocontrol diferente. No estás evitando el fracaso, lo estás usando como combustible.',
    howToEarn: 'Después de una recaída, alcanza una racha de 7 días.',
    requirement: 7,
    metric: 'comeback_streak',
    contextPriority: 35,
  },

  // ── CODE ─────────────────────────────────────────

  {
    id: 'full_code',
    category: 'code',
    rarity: 'common',
    icon: 'CheckSquare',
    iconColor: '#30D158',
    accentColor: 'rgba(48,209,88,0.4)',
    accentColorDim: 'rgba(48,209,88,0.07)',
    name: 'Código Completo',
    tagline: 'Todas las reglas en un día.',
    description: 'Completaste todas tus reglas en un solo día. Esto significa que tu código no es decorativo, es funcional. Lo escribiste y lo cumpliste el mismo día.',
    howToEarn: 'Marca todas tus reglas activas como completadas en un mismo día.',
    requirement: 1,
    metric: 'rules_completed_today',
    contextPriority: 15,
  },

  // ── PROJECT ──────────────────────────────────────

  {
    id: 'first_victory',
    category: 'project',
    rarity: 'common',
    icon: 'Target',
    iconColor: '#0A84FF',
    accentColor: 'rgba(10,132,255,0.5)',
    accentColorDim: 'rgba(10,132,255,0.08)',
    name: 'Primera Victoria',
    tagline: 'El primero de muchos.',
    description: 'Registraste tu primera victoria en el sistema. No importa el tamaño. Importa que lo notaste, lo escribiste y lo reconociste. Así se construye una identidad ganadora.',
    howToEarn: 'Registra tu primera victoria en la sección Proyecto.',
    requirement: 1,
    metric: 'victories',
    contextPriority: 12,
  },
  {
    id: 'ten_victories',
    category: 'project',
    rarity: 'rare',
    icon: 'Layers',
    iconColor: '#0A84FF',
    accentColor: 'rgba(10,132,255,0.6)',
    accentColorDim: 'rgba(10,132,255,0.10)',
    name: 'Constructor',
    tagline: '10 victorias registradas.',
    description: 'Diez victorias en el registro. Esto ya es un patrón. Estás construyendo algo real y lo puedes ver escrito. El pasado ya no te define. Tu historial de victorias sí.',
    howToEarn: 'Acumula 10 victorias registradas en la sección Proyecto.',
    requirement: 10,
    metric: 'victories',
    contextPriority: 22,
  },
];

/* ═══════════════════════════════════════════════════
   computeBadges — calcula el estado dinámico
═══════════════════════════════════════════════════ */
export function computeBadges(stats: UserStats): Badge[] {
  return BADGE_DEFINITIONS.map(def => {
    let currentValue = 0;

    switch (def.metric) {
      case 'streak':
        currentValue = stats.streak;
        break;
      case 'best_streak':
        currentValue = stats.bestStreak;
        break;
      case 'total_days':
        currentValue = stats.totalDays;
        break;
      case 'rules_completed_today': {
        const enabled  = stats.rules.filter(r => r.enabled);
        const checked  = enabled.filter(r => stats.checks[r.id]);
        currentValue   = enabled.length > 0 && checked.length === enabled.length ? 1 : 0;
        break;
      }
      case 'victories':
        currentValue = stats.victories.length;
        break;
      case 'comeback_streak':
        currentValue = stats.isComeback ? stats.comebackStreak : 0;
        break;
    }

    const progress = Math.min(currentValue / def.requirement, 1);
    let status: BadgeStatus = 'locked';
    if (currentValue >= def.requirement) status = 'unlocked';
    else if (currentValue > 0)          status = 'in_progress';

    return {
      ...def,
      status,
      progress,
      currentValue,
      unlockedAt: stats.unlockedBadgeHistory[def.id],
    };
  });
}

/* ═══════════════════════════════════════════════════
   getContextualBadge — máx 1 badge para Tab HOY
═══════════════════════════════════════════════════ */
export function getContextualBadge(badges: Badge[]): Badge | null {
  const today = new Date().toISOString().split('T')[0];

  // 1. Recién desbloqueado hoy
  const justUnlocked = badges
    .filter(b => b.status === 'unlocked' && b.unlockedAt?.startsWith(today))
    .sort((a, b) => b.contextPriority - a.contextPriority)[0];
  if (justUnlocked) return justUnlocked;

  // 2. En progreso y > 50% completo
  const closest = badges
    .filter(b => b.status === 'in_progress')
    .sort((a, b) => b.progress - a.progress)[0];
  if (closest && closest.progress > 0.5) return closest;

  // 3. Cualquier en progreso
  return closest ?? null;
}

/* ═══════════════════════════════════════════════════
   Legacy helpers (para compatibilidad con código antiguo)
═══════════════════════════════════════════════════ */
export function evaluateBadges(stats: {
  streak: number; bestStreak: number; totalDays: number;
  relapses: number; victories: number;
  rulesCompletedToday: number; rulesTotalToday: number;
}): string[] {
  const userStats: UserStats = {
    streak:          stats.streak,
    bestStreak:      stats.bestStreak,
    totalDays:       stats.totalDays,
    relapses:        Array.from({ length: stats.relapses }, () => ({ date: '', days_reached: 0, trigger: '' })), 
    victories:       Array.from({ length: stats.victories }, () => ({ date: '', text: '' })), 
    rules:           Array(stats.rulesTotalToday).fill({ id: `r`, text: '', enabled: true }),
    checks:          stats.rulesCompletedToday === stats.rulesTotalToday && stats.rulesTotalToday > 0
                       ? Object.fromEntries(Array.from({ length: stats.rulesTotalToday }, (_, i) => [`r${i}`, true]))
                       : {},
    isComeback:      false,
    comebackStreak:  0,
    unlockedBadgeHistory: {},
  };
  return computeBadges(userStats).filter(b => b.status === 'unlocked').map(b => b.id);
}

