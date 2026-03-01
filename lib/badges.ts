export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  icon: string; // emoji / short icon key
  criteria: (stats: BadgeStats) => boolean;
}

export interface BadgeStats {
  streak: number;
  bestStreak: number;
  totalDays: number;
  relapses: number;
  victories: number;
  rulesCompletedToday: number;
  rulesTotalToday: number;
}

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'first_checkin',
    name: 'Primer Día',
    description: 'Tu primer día cumplido en el sistema.',
    rarity: 'common',
    icon: '◼︎',
    criteria: (s) => s.totalDays >= 1,
  },
  {
    id: 'streak_3',
    name: 'Ritmo 3',
    description: '3 días seguidos. Empiezas a ser constante.',
    rarity: 'common',
    icon: '▲',
    criteria: (s) => s.streak >= 3 || s.bestStreak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Semana de Acero',
    description: '7 días seguidos. El hábito ya te pertenece.',
    rarity: 'rare',
    icon: '✶',
    criteria: (s) => s.streak >= 7 || s.bestStreak >= 7,
  },
  {
    id: 'streak_14',
    name: 'Núcleo',
    description: '14 días seguidos. Entras en fase sólida.',
    rarity: 'rare',
    icon: '◆',
    criteria: (s) => s.streak >= 14 || s.bestStreak >= 14,
  },
  {
    id: 'streak_30',
    name: 'Legendario',
    description: '30 días seguidos. Disciplina real.',
    rarity: 'legendary',
    icon: '✦',
    criteria: (s) => s.streak >= 30 || s.bestStreak >= 30,
  },
  {
    id: 'perfect_rules',
    name: 'Código Perfecto',
    description: 'Completa todas tus reglas en un día.',
    rarity: 'rare',
    icon: '◎',
    criteria: (s) => s.rulesTotalToday > 0 && s.rulesCompletedToday === s.rulesTotalToday,
  },
  {
    id: 'victories_5',
    name: 'Constructor',
    description: '5 victorias registradas.',
    rarity: 'epic',
    icon: '▣',
    criteria: (s) => s.victories >= 5,
  },
  {
    id: 'resilience',
    name: 'Reinicio Consciente',
    description: 'Volver tras una recaída y mantener 3 días seguidos.',
    rarity: 'epic',
    icon: '↻',
    criteria: (s) => s.relapses > 0 && s.streak >= 3,
  },
  {
    id: 'total_50',
    name: 'Arquitecto',
    description: '50 días cumplidos en total.',
    rarity: 'legendary',
    icon: '⬣',
    criteria: (s) => s.totalDays >= 50,
  },
  {
    id: 'streak_60',
    name: 'Columna de Acero',
    description: '60 días seguidos. Voluntad estable.',
    rarity: 'legendary',
    icon: '▮',
    criteria: (s) => s.streak >= 60 || s.bestStreak >= 60,
  },
  {
    id: 'streak_90',
    name: 'Mente Inquebrantable',
    description: '90 días seguidos. Sistema internalizado.',
    rarity: 'legendary',
    icon: '◉',
    criteria: (s) => s.streak >= 90 || s.bestStreak >= 90,
  },
  {
    id: 'total_100',
    name: 'Centinela',
    description: '100 días cumplidos en total.',
    rarity: 'epic',
    icon: '◧',
    criteria: (s) => s.totalDays >= 100,
  },
  {
    id: 'victories_20',
    name: 'Forjador',
    description: '20 victorias registradas.',
    rarity: 'epic',
    icon: '▩',
    criteria: (s) => s.victories >= 20,
  },
  {
    id: 'rules_7',
    name: 'Código Consistente',
    description: '7 días con todas tus reglas completadas.',
    rarity: 'rare',
    icon: '◍',
    criteria: (s) => s.rulesTotalToday > 0 && s.rulesCompletedToday === s.rulesTotalToday && s.totalDays >= 7,
  },
  {
    id: 'zero_relapse_14',
    name: 'Cero Ruido',
    description: '14 días sin recaídas registradas.',
    rarity: 'rare',
    icon: '⟡',
    criteria: (s) => s.relapses === 0 && s.totalDays >= 14,
  },
  {
    id: 'rebirth',
    name: 'Renacer',
    description: 'Volver tras recaída y alcanzar 7 días seguidos.',
    rarity: 'epic',
    icon: '↺',
    criteria: (s) => s.relapses > 0 && (s.streak >= 7 || s.bestStreak >= 7),
  },
  {
    id: 'iron_total_180',
    name: 'Eje 180',
    description: '180 días totales. Dominio absoluto del proceso.',
    rarity: 'legendary',
    icon: '⬡',
    criteria: (s) => s.totalDays >= 180,
  },
];

export function evaluateBadges(stats: BadgeStats): string[] {
  return badgeDefinitions.filter(b => b.criteria(stats)).map(b => b.id);
}
