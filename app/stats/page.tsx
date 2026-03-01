'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { storage } from '@/lib/storage';
import { getLast30Days, getStreakHistory, getCurrentMonthCalendar } from '@/lib/chartData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { staggerContainer, cardEntrance } from '@/lib/animations';

const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
// LinearGradient defined inline in SVG defs — no dynamic import needed

function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display}</>;
}

function Heatmap({ data }: { data: { date: string; status: string }[] }) {
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const colorMap: Record<string, string> = {
    done: 'rgba(61,219,130,0.8)',
    relapse: 'rgba(255,77,77,0.6)',
    future: '#1C1C26',
    today: 'transparent',
    empty: '#1C1C26',
  };
  const borderMap: Record<string, string> = {
    today: 'rgba(255,255,255,0.30)',
    done: 'none',
    relapse: 'none',
    future: 'none',
    empty: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', paddingLeft: '2px' }}>
        {dayLabels.map(d => (
          <div key={d} style={{ width: 10, fontSize: '9px', color: '#262636', fontWeight: 600, letterSpacing: '0.5px', textAlign: 'center' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {data.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.015 }}
            style={{
              width: 10, height: 10, borderRadius: '3px',
              background: colorMap[day.status] ?? '#1C1C26',
              border: `1px solid ${borderMap[day.status] ?? 'transparent'}`,
            }}
            title={`${day.date}: ${day.status}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [relapses, setRelapses] = useState<{ date: string; days_reached: number; trigger: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    setStreak(storage.getStreak());
    setBestStreak(storage.getBestStreak());
    setTotalDays(storage.getTotalDays());
    setRelapses(storage.getRelapses());
  }, []);

  const last30 = useMemo(() => (mounted ? getLast30Days() : []), [mounted]);
  const streakHistory = useMemo(() => (mounted ? getStreakHistory() : []), [mounted]);
  const calendarData = useMemo(() => (mounted ? getCurrentMonthCalendar() : []), [mounted]);

  const isRecord = streak > 0 && streak >= bestStreak && streak > 1;

  if (!mounted) return null;

  const statCards = [
    { label: 'RACHA ACTUAL', value: streak, color: '#3DDB82' },
    { label: 'MEJOR RACHA', value: bestStreak, color: isRecord ? '#E2B96A' : '#EFEFF4', badge: isRecord && bestStreak > 0 },
    { label: 'DÍAS TOTALES', value: totalDays, color: '#EFEFF4' },
    { label: 'RECAÍDAS', value: relapses.length, color: relapses.length > 0 ? '#FF4D4D' : '#3E3E52', display: relapses.length > 0 ? String(relapses.length) : '—' },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#7A7A8C' }}>REGISTROS</span>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* 2x2 stat grid */}
        <motion.div variants={cardEntrance} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {statCards.map(card => (
            <div
              key={card.label}
              style={{
                padding: '20px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: 'clamp(28px,7vw,40px)', fontWeight: 700, color: card.color, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
                {card.display ?? <CountUp value={card.value} />}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#3E3E52', marginTop: '6px' }}>
                {card.label}
              </div>
              {card.badge && (
                <div style={{
                  display: 'inline-block', marginTop: '8px',
                  padding: '3px 10px', borderRadius: '9999px',
                  background: 'rgba(226,185,106,0.10)', border: '1px solid rgba(226,185,106,0.30)',
                  color: '#E2B96A', fontSize: '9px', fontWeight: 600, letterSpacing: '1px',
                }}>
                  RÉCORD
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Activity chart - last 30 days */}
        <GlassCard level={1} animate style={{ padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C', marginBottom: '16px' }}>
            ÚLTIMOS 30 DÍAS
          </p>
          {last30.length > 0 && (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={last30} barSize={6} barGap={2}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    background: '#1C1C26', border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '12px', color: '#EFEFF4', fontSize: '12px',
                  }}
                  formatter={(_value: unknown, _name: unknown, props: { payload?: { value?: number; label?: string } }) => {
                    const v = props.payload?.value;
                    return [v === 1 ? '✓ Cumplido' : v === -1 ? '✗ Recaída' : '— Sin dato', props.payload?.label];
                  }}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={1000} animationEasing="ease-out">
                  {last30.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.value === 1 ? 'rgba(61,219,130,0.8)' : entry.value === -1 ? 'rgba(255,77,77,0.6)' : 'rgba(255,255,255,0.06)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Streak history chart */}
        <GlassCard level={1} animate style={{ padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C', marginBottom: '16px' }}>
            RACHAS HISTÓRICAS
          </p>
          {streakHistory.length <= 1 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '13px', color: '#262636', margin: 0 }}>Tu historial de rachas aparecerá aquí.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={streakHistory}>
                <defs>
                  <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3DDB82" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3DDB82" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#3E3E52', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1C1C26', border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '12px', color: '#EFEFF4', fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="days"
                  stroke="#3DDB82"
                  strokeWidth={2}
                  fill="url(#streakGrad)"
                  dot={{ fill: '#13131A', stroke: '#3DDB82', strokeWidth: 2, r: 4 }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Heatmap */}
        <GlassCard level={1} animate style={{ padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C', marginBottom: '16px' }}>
            ESTE MES
          </p>
          <Heatmap data={calendarData} />
        </GlassCard>

        {/* Relapse history */}
        <GlassCard level={1} animate style={{ padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C', marginBottom: '16px' }}>
            HISTORIAL
          </p>
          {relapses.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#262636', textAlign: 'center', margin: 0 }}>Sin recaídas registradas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {relapses.slice().reverse().map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < relapses.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#3E3E52', whiteSpace: 'nowrap', fontWeight: 600 }}>{r.date}</span>
                  <span style={{ fontSize: '13px', color: '#7A7A8C', flex: 1 }}>Día {r.days_reached} alcanzado</span>
                  <span style={{ fontSize: '11px', color: '#3E3E52' }}>{r.trigger}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </PageWrapper>
  );
}
