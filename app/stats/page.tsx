'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { storage, todayStr } from '@/lib/storage';
import { getLast30Days, getStreakHistory, getCurrentMonthCalendar } from '@/lib/chartData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { staggerContainer, cardEntrance } from '@/lib/animations';
import { badgeDefinitions, evaluateBadges, BadgeRarity } from '@/lib/badges';

// Lazy-load Recharts
const BarChart        = dynamic(() => import('recharts').then(m => m.BarChart),        { ssr: false });
const Bar             = dynamic(() => import('recharts').then(m => m.Bar),             { ssr: false });
const AreaChart       = dynamic(() => import('recharts').then(m => m.AreaChart),       { ssr: false });
const Area            = dynamic(() => import('recharts').then(m => m.Area),            { ssr: false });
const XAxis           = dynamic(() => import('recharts').then(m => m.XAxis),           { ssr: false });
const Tooltip         = dynamic(() => import('recharts').then(m => m.Tooltip),         { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const CartesianGrid   = dynamic(() => import('recharts').then(m => m.CartesianGrid),   { ssr: false });
const Cell            = dynamic(() => import('recharts').then(m => m.Cell),            { ssr: false });

const tooltipStyle = {
  background: '#1C1C26',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '14px',
  color: '#EFEFF4',
  fontSize: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const rarityStyles: Record<BadgeRarity, { label: string; color: string; border: string; }> = {
  common: { label: 'COMÚN', color: '#7A7A8C', border: 'rgba(255,255,255,0.08)' },
  rare: { label: 'RARO', color: '#3DDB82', border: 'rgba(61,219,130,0.25)' },
  epic: { label: 'ÉPICO', color: '#7B6CFF', border: 'rgba(123,108,255,0.35)' },
  legendary: { label: 'LEG', color: '#E2B96A', border: 'rgba(226,185,106,0.35)' },
};

/* ─── Count-up animation ───────────────────── */
function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const start = Date.now();
    const tick  = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(e * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display}</>;
}

/* ─── Month heatmap ────────────────────────── */
function Heatmap({ data }: { data: { date: string; status: string }[] }) {
  const dayLabels = ['L','M','X','J','V','S','D'];
  const colorMap: Record<string, string> = {
    done:    'rgba(61,219,130,0.82)',
    relapse: 'rgba(255,77,77,0.65)',
    future:  '#1C1C26',
    today:   'transparent',
    empty:   'rgba(255,255,255,0.04)',
  };
  const borderMap: Record<string, string> = {
    today:   'rgba(255,255,255,0.25)',
    done:    'rgba(61,219,130,0.2)',
    relapse: 'rgba(255,77,77,0.2)',
    future:  'transparent',
    empty:   'transparent',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
        {dayLabels.map(d => (
          <div key={d} style={{ width: 11, fontSize: '8.5px', color: '#3E3E52', fontWeight: 700, textAlign: 'center', letterSpacing: '0.3px' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {data.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.012, type: 'spring', stiffness: 400, damping: 30 }}
            title={`${day.date}`}
            style={{
              width: 11, height: 11, borderRadius: '4px',
              background: colorMap[day.status] ?? '#1C1C26',
              border: `1px solid ${borderMap[day.status] ?? 'transparent'}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Glass card wrapper ────────────────────── */
function StatSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={cardEntrance}
      style={{
        padding: '20px', borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06) inset',
      }}
    >
      <p className="text-label" style={{ color: '#7A7A8C', marginBottom: '16px', letterSpacing: '1.8px' }}>{label}</p>
      {children}
    </motion.div>
  );
}

export default function StatsPage() {
  const [mounted, setMounted]   = useState(false);
  const [streak, setStreak]     = useState(0);
  const [best, setBest]         = useState(0);
  const [total, setTotal]       = useState(0);
  const [relapses, setRelapses] = useState<{ date: string; days_reached: number; trigger: string }[]>([]);
  const [rulesTotal, setRulesTotal] = useState(0);
  const [rulesDone, setRulesDone] = useState(0);

  useEffect(() => {
    setMounted(true);
    setStreak(storage.getStreak());
    setBest(storage.getBestStreak());
    setTotal(storage.getTotalDays());
    setRelapses(storage.getRelapses());

    const today = todayStr();
    const rules = storage.getRules().filter(r => r.enabled);
    const checks = storage.getChecks(today);
    setRulesTotal(rules.length);
    setRulesDone(rules.filter(r => checks[r.id]).length);
  }, []);

  const last30       = useMemo(() => mounted ? getLast30Days()           : [], [mounted]);
  const streakHist   = useMemo(() => mounted ? getStreakHistory()         : [], [mounted]);
  const calendarData = useMemo(() => mounted ? getCurrentMonthCalendar() : [], [mounted]);

  const isRecord = streak > 0 && streak >= best && streak > 1;

  const badgeStats = useMemo(() => ({
    streak,
    bestStreak: best,
    totalDays: total,
    relapses: relapses.length,
    victories: storage.getVictories().length,
    rulesCompletedToday: rulesDone,
    rulesTotalToday: rulesTotal,
  }), [streak, best, total, relapses.length, rulesDone, rulesTotal]);

  const unlocked = useMemo(() => new Set(evaluateBadges(badgeStats)), [badgeStats]);

  if (!mounted) return null;

  const statCards = [
    { label: 'RACHA ACTUAL', value: streak, color: '#3DDB82', glow: 'rgba(61,219,130,0.10)' },
    { label: 'MEJOR RACHA',  value: best,   color: isRecord ? '#E2B96A' : '#EFEFF4', badge: isRecord && best > 0, glow: isRecord ? 'rgba(226,185,106,0.08)' : undefined },
    { label: 'DÍAS TOTALES', value: total,  color: '#EFEFF4', glow: undefined },
    { label: 'RECAÍDAS',     value: relapses.length, color: relapses.length > 0 ? '#FF4D4D' : '#3E3E52', display: relapses.length > 0 ? String(relapses.length) : '—', glow: relapses.length > 0 ? 'rgba(255,77,77,0.08)' : undefined },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '20px 20px 4px' }}>
        <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '2.5px' }}>REGISTROS</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {/* ── 2×2 stat grid ── */}
        <motion.div variants={cardEntrance} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
          {statCards.map(card => (
            <div key={card.label} style={{
              padding: '20px 18px', borderRadius: '20px',
              background: card.glow
                ? `linear-gradient(145deg, ${card.glow} 0%, rgba(255,255,255,0.03) 100%)`
                : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06) inset',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                fontSize: 'clamp(28px,7vw,38px)', fontWeight: 800, color: card.color,
                letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>
                {card.display ?? <CountUp value={card.value} />}
              </div>
              <div className="text-label" style={{ color: '#3E3E52', marginTop: '8px', fontSize: '9.5px', letterSpacing: '1px' }}>
                {card.label}
              </div>
              {card.badge && (
                <div style={{
                  display: 'inline-block', marginTop: '8px',
                  padding: '3px 10px', borderRadius: '9999px',
                  background: 'rgba(226,185,106,0.10)', border: '1px solid rgba(226,185,106,0.25)',
                  color: '#E2B96A', fontSize: '9px', fontWeight: 700, letterSpacing: '1px',
                }}>
                  RÉCORD
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Activity 30 days ── */}
        <StatSection label="ÚLTIMOS 30 DÍAS">
          {last30.length > 0 && (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={last30} barSize={5} barGap={2}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={tooltipStyle}
                  formatter={(_v: unknown, _n: unknown, props: { payload?: { value?: number; label?: string } }) => {
                    const v = props.payload?.value;
                    return [v === 1 ? '✓ Cumplido' : v === -1 ? '✗ Recaída' : '— Sin dato', props.payload?.label ?? ''];
                  }}
                />
                <Bar dataKey="value" radius={[3,3,0,0]} animationDuration={1000} animationEasing="ease-out">
                  {last30.map((e, i) => (
                    <Cell key={i} fill={e.value === 1 ? 'rgba(61,219,130,0.82)' : e.value === -1 ? 'rgba(255,77,77,0.65)' : 'rgba(255,255,255,0.06)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </StatSection>

        {/* ── Streak history ── */}
        <StatSection label="RACHAS HISTÓRICAS">
          {streakHist.length <= 1 ? (
            <p style={{ fontSize: '13px', color: '#262636', textAlign: 'center', padding: '20px 0' }}>
              Tu historial de rachas aparecerá aquí.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={streakHist}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3DDB82" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#3DDB82" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#3E3E52', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone" dataKey="days"
                  stroke="#3DDB82" strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#13131A', stroke: '#3DDB82', strokeWidth: 2, r: 3 }}
                  animationDuration={1000} animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </StatSection>

        {/* ── Heatmap ── */}
        <StatSection label="ESTE MES">
          <Heatmap data={calendarData} />
        </StatSection>

        {/* ── Badges (compact) ── */}
        <StatSection label="BADGES">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {badgeDefinitions.map(b => {
              const isUnlocked = unlocked.has(b.id);
              const rarity = rarityStyles[b.rarity];
              return (
                <div
                  key={b.id}
                  className={b.rarity === 'legendary' ? 'legendary-shine' : ''}
                  style={{
                    padding: '10px', borderRadius: '14px',
                    background: isUnlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${rarity.border}`,
                    opacity: isUnlocked ? 1 : 0.4,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '16px', color: rarity.color, fontWeight: 700, marginBottom: '6px' }}>{b.icon}</div>
                  <div style={{ fontSize: '10px', color: '#EFEFF4', fontWeight: 600, letterSpacing: '-0.2px' }}>{b.name}</div>
                  <div style={{ fontSize: '8px', color: rarity.color, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{rarity.label}</div>
                </div>
              );
            })}
          </div>
        </StatSection>

        {/* ── Relapse history ── */}
        <StatSection label="HISTORIAL">
          {relapses.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#262636', textAlign: 'center', padding: '8px 0' }}>
              Sin recaídas registradas.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {relapses.slice().reverse().map((r, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'center',
                  padding: '11px 0',
                  borderBottom: i < relapses.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ fontSize: '10px', color: '#3E3E52', whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: '0.5px', minWidth: '60px' }}>{r.date}</span>
                  <span style={{ fontSize: '13px', color: '#7A7A8C', flex: 1 }}>Día {r.days_reached}</span>
                  <span style={{ fontSize: '11px', color: '#3E3E52', textAlign: 'right', maxWidth: '110px', lineHeight: 1.3 }}>{r.trigger}</span>
                </div>
              ))}
            </div>
          )}
        </StatSection>
      </motion.div>
    </PageWrapper>
  );
}
