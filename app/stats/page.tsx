'use client';
import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { TrendingUp, Zap, Calendar, Award, Download, Upload, Trash2 } from 'lucide-react';
import { storage, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Toast } from '@/components/ui/Toast';
import { badgeDefinitions, evaluateBadges } from '@/lib/badges';
import { staggerContainer, cardEntrance, springs } from '@/lib/animations';

/* ── Chart tooltip personalizado ── */
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(22,22,31,0.95)', backdropFilter: 'blur(24px)',
      border: '0.5px solid rgba(255,255,255,0.10)', borderRadius: 'var(--r-md)',
      padding: '8px 12px', fontSize: '12px', color: 'var(--t1)',
    }}>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--t3)' }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: 'var(--green)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Heatmap del mes ── */
function MonthHeatmap({ history }: { history: { date: string; completed: boolean; streak: number }[] }) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();
  const days  = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const byDate = useMemo(() => {
    const map: Record<string, boolean> = {};
    history.forEach(h => { map[h.date] = h.completed; });
    return map;
  }, [history]);

  const cells: (null | { day: number; date: string; done: boolean; isToday: boolean })[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: days }, (_, i) => {
      const d   = i + 1;
      const iso = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      return { day: d, date: iso, done: !!byDate[iso], isToday: iso === todayStr() };
    }),
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
      {['D','L','M','X','J','V','S'].map(l => (
        <div key={l} style={{ textAlign: 'center', fontSize: '9px', color: 'var(--t4)', fontWeight: 700, letterSpacing: '0.05em', paddingBottom: '4px' }}>{l}</div>
      ))}
      {cells.map((c, i) => (
        c === null ? <div key={i} /> : (
          <div
            key={c.date}
            title={c.date}
            style={{
              aspectRatio: '1', borderRadius: 'var(--r-xs)',
              background: c.done
                ? 'linear-gradient(135deg, #1A9E45, #30D158)'
                : 'rgba(255,255,255,0.04)',
              border: c.isToday ? '1px solid rgba(48,209,88,0.50)' : '0.5px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', color: c.done ? 'rgba(255,255,255,0.85)' : 'var(--t4)',
              fontWeight: c.isToday ? 700 : 400,
              boxShadow: c.done ? '0 0 6px rgba(48,209,88,0.18)' : 'none',
            }}
          >
            {c.day}
          </div>
        )
      ))}
    </div>
  );
}

/* ── StatCard ── */
function StatCard({ label, value, icon: Icon, color = 'var(--t1)', sub }: {
  label: string; value: string | number; icon: React.ElementType; color?: string; sub?: string;
}) {
  return (
    <motion.div
      variants={cardEntrance}
      className="glass-1"
      style={{ flex: 1, minWidth: 0, padding: '18px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Icon size={15} color="var(--t4)" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 'clamp(24px,6vw,34px)', fontWeight: 800, color, letterSpacing: '-0.05em', lineHeight: 1 }}>
        {value}
      </div>
      <div className="text-label" style={{ color: 'var(--t4)', marginTop: '6px', fontSize: '10px' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>{sub}</div>}
    </motion.div>
  );
}

export default function StatsPage() {
  const [mounted,     setMounted    ] = useState(false);
  const [streak,      setStreak     ] = useState(0);
  const [best,        setBest       ] = useState(0);
  const [total,       setTotal      ] = useState(0);
  const [relapses,    setRelapses   ] = useState<{ date: string; days_reached: number; trigger: string }[]>([]);
  const [rulesTotal,  setRulesTotal ] = useState(0);
  const [rulesDone,   setRulesDone  ] = useState(0);
  const [history,     setHistory    ] = useState<{ date: string; completed: boolean; streak: number }[]>([]);

  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [toastMessage,    setToastMessage   ] = useState('');
  const [toastVisible,    setToastVisible   ] = useState(false);
  const [toastVariant,    setToastVariant   ] = useState<'success'|'info'|'warning'>('info');
  const [importError,     setImportError    ] = useState('');

  const showToast = useCallback((msg: string, variant: 'success'|'info'|'warning' = 'info') => {
    setToastMessage(msg);
    setToastVariant(variant);
    setToastVisible(true);
  }, []);

  const refreshStats = useCallback(() => {
    setStreak(storage.getStreak());
    setBest(storage.getBestStreak());
    setTotal(storage.getTotalDays());
    setRelapses(storage.getRelapses());
    setHistory(storage.getHistory());
    const today = todayStr();
    const rules = storage.getRules().filter(r => r.enabled);
    const checks = storage.getChecks(today);
    setRulesTotal(rules.length);
    setRulesDone(rules.filter(r => checks[r.id]).length);
  }, []);

  useEffect(() => { setMounted(true); refreshStats(); }, [refreshStats]);

  /* ── Chart data ── */
  const activityData = useMemo(() => {
    const last30 = history.slice(-30).map(h => ({
      date: h.date.slice(5),
      racha: h.streak,
      cumplido: h.completed ? 1 : 0,
    }));
    return last30;
  }, [history]);

  /* ── Badge stats ── */
  const badgeStats = useMemo(() => ({
    streak, bestStreak: best, totalDays: total,
    relapses: relapses.length, victories: storage.getVictories().length,
    rulesCompletedToday: rulesDone, rulesTotalToday: rulesTotal,
  }), [streak, best, total, relapses.length, rulesDone, rulesTotal]);

  const unlockedBadges = useMemo(() => new Set(evaluateBadges(badgeStats)), [badgeStats]);

  /* ── Export ── */
  const handleExport = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data: storage.exportData() }, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `eca-backup-${todayStr()}.json` });
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      showToast('Backup descargado.', 'success');
    } catch { showToast('No se pudo exportar.', 'warning'); }
  }, [showToast]);

  /* ── Import ── */
  const handleImportFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result ?? '{}')) as { data?: Record<string,string> };
        const payload = parsed.data ?? parsed;
        const entries = Object.entries(payload as Record<string,string>).filter(([k,v]) => k.startsWith('eca_') && typeof v === 'string');
        if (!entries.length) { setImportError('Sin datos ECA válidos.'); return; }
        storage.clearAll();
        storage.importData(Object.fromEntries(entries));
        refreshStats();
        showToast('Datos importados.', 'success');
      } catch { setImportError('No se pudo leer el archivo.'); }
      finally { e.target.value = ''; }
    };
    reader.readAsText(file);
  }, [refreshStats, showToast]);

  /* ── Delete ── */
  const confirmDelete = useCallback(() => {
    storage.clearAll(); refreshStats();
    setShowDeleteSheet(false);
    showToast('Datos eliminados.', 'warning');
  }, [refreshStats, showToast]);

  if (!mounted) return null;

  const ringPct   = Math.min(100, (streak / 7) * 100);
  const isGold    = streak >= 7;

  return (
    <PageWrapper glowState={streak > 14 ? 'fire' : 'neutral'}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 20px 10px' }}>
        <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px' }}>ESTADÍSTICAS</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >

        {/* ══════════════════════════════════
            RACHA HERO
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance} className="glass-2" style={{ padding: '28px 24px' }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ProgressRing value={ringPct} size={100} strokeWidth={4} gold={isGold} />
            <div>
              <div className="text-label" style={{ color: isGold ? 'var(--gold-warm)' : 'var(--green)', marginBottom: '8px', letterSpacing: '2px' }}>
                RACHA ACTUAL
              </div>
              <span
                className={isGold ? 'text-gradient-gold' : 'text-gradient-green'}
                style={{ fontSize: 'clamp(44px,12vw,68px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9, display: 'block' }}
              >
                {streak}
              </span>
              <p style={{ fontSize: '13px', color: 'var(--t3)', marginTop: '6px' }}>
                {streak === 1 ? 'día' : 'días'} consecutivos
              </p>
              {streak >= 7 && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '10px',
                  padding: '4px 10px', borderRadius: 'var(--r-full)',
                  background: 'rgba(232,184,75,0.10)', border: '0.5px solid rgba(232,184,75,0.25)',
                  fontSize: '10px', fontWeight: 700, color: 'var(--gold-warm)', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  <Award size={10} strokeWidth={2} />
                  Semana completa
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats grid ── */}
        <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '8px' }}>
          <StatCard
            label="MEJOR RACHA" value={best} icon={TrendingUp}
            color={best > 0 ? 'var(--gold-warm)' : 'var(--t4)'}
          />
          <StatCard label="TOTAL DÍAS" value={total} icon={Calendar} />
          <StatCard
            label="RECAÍDAS" value={relapses.length || '—'} icon={Zap}
            color={relapses.length > 0 ? 'var(--red)' : 'var(--t4)'}
          />
        </motion.div>

        {/* ══════════════════════════════════
            HEATMAP
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance} className="glass-1" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px' }}>ESTE MES</span>
            <span style={{ fontSize: '12px', color: 'var(--t4)', fontWeight: 600 }}>
              {history.filter(h => h.date.startsWith(todayStr().slice(0, 7)) && h.completed).length} días ✓
            </span>
          </div>
          <MonthHeatmap history={history} />
        </motion.div>

        {/* ══════════════════════════════════
            GRÁFICA ACTIVIDAD
        ══════════════════════════════════ */}
        {activityData.length > 0 && (
          <motion.div variants={cardEntrance} className="glass-1" style={{ padding: '20px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px', display: 'block', marginBottom: '16px' }}>
              ACTIVIDAD 30 DÍAS
            </span>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={activityData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#30D158" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#30D158" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--t4)' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--t4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="racha" name="Racha" stroke="#30D158" strokeWidth={1.5} fill="url(#areaGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ══════════════════════════════════
            GRÁFICA RECAÍDAS (si hay)
        ══════════════════════════════════ */}
        {relapses.length > 0 && (
          <motion.div variants={cardEntrance} className="glass-1" style={{ padding: '20px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px', display: 'block', marginBottom: '16px' }}>
              RACHAS HISTÓRICAS
            </span>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart
                data={relapses.map((r, i) => ({ n: `#${i+1}`, días: r.days_reached }))}
                margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
              >
                <XAxis dataKey="n" tick={{ fontSize: 9, fill: 'var(--t4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--t4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="días" fill="rgba(255,59,48,0.35)" radius={[4,4,0,0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ══════════════════════════════════
            BADGES
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px', marginBottom: '10px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px' }}>BADGES</span>
            <span style={{ fontSize: '12px', color: 'var(--t4)', fontWeight: 600 }}>
              {unlockedBadges.size}/{badgeDefinitions.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {badgeDefinitions.map(b => {
              const isUnlocked = unlockedBadges.has(b.id);
              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: 'var(--r-md)',
                    background: isUnlocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    border: `0.5px solid ${isUnlocked ? 'rgba(255,255,255,0.10)' : 'var(--border-dim)'}`,
                    opacity: isUnlocked ? 1 : 0.35,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{b.icon}</span>
                  <span style={{ fontSize: '12px', color: isUnlocked ? 'var(--t2)' : 'var(--t4)', fontWeight: 500, lineHeight: 1.3 }}>
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════
            HISTORIAL DE RECAÍDAS
        ══════════════════════════════════ */}
        {relapses.length > 0 && (
          <motion.div variants={cardEntrance} className="glass-1" style={{ padding: '20px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px', display: 'block', marginBottom: '14px' }}>
              HISTORIAL
            </span>
            {relapses.slice().reverse().map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                  padding: '11px 0',
                  borderBottom: i < relapses.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--t4)', whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: '0.5px', minWidth: '54px' }}>
                  {r.date}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--t3)', flex: 1 }}>Día {r.days_reached}</span>
                <span style={{ fontSize: '11px', color: 'var(--t4)', textAlign: 'right', maxWidth: '110px', lineHeight: 1.3 }}>
                  {r.trigger}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ══════════════════════════════════
            GESTIÓN DE DATOS
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance}>
          <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px', display: 'block', marginBottom: '10px', padding: '0 2px' }}>
            DATOS
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Exportar + Importar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                onClick={handleExport}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '16px', borderRadius: 'var(--r-lg)',
                  background: 'rgba(48,209,88,0.08)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '0.5px solid rgba(48,209,88,0.22)',
                  borderTopColor: 'rgba(48,209,88,0.35)',
                  color: 'var(--green)', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                <Download size={14} strokeWidth={2} />
                Exportar
              </motion.button>

              <label
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '16px', borderRadius: 'var(--r-lg)',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '0.5px solid rgba(255,255,255,0.10)',
                  borderTopColor: 'rgba(255,255,255,0.16)',
                  color: 'var(--t2)', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <Upload size={14} strokeWidth={2} />
                Importar
                <input type="file" accept="application/json" onChange={handleImportFile} style={{ display: 'none' }} />
              </label>
            </div>

            {importError && (
              <p style={{ fontSize: '12px', color: 'var(--red)', textAlign: 'center', padding: '4px 0' }}>{importError}</p>
            )}

            {/* Borrar */}
            <div style={{
              padding: '16px 18px', borderRadius: 'var(--r-lg)',
              background: 'rgba(255,59,48,0.06)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '0.5px solid rgba(255,59,48,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
              <div>
                <div className="text-label" style={{ color: 'var(--red)', letterSpacing: '1px' }}>BORRAR DATOS</div>
                <div style={{ fontSize: '12px', color: 'var(--t4)', marginTop: '4px' }}>
                  Reinicia la app y tus rachas.
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                onClick={() => setShowDeleteSheet(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: 'var(--r-full)',
                  background: 'rgba(255,59,48,0.12)',
                  border: '0.5px solid rgba(255,59,48,0.32)',
                  color: 'var(--red)', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                <Trash2 size={12} strokeWidth={2} />
                Borrar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Delete confirmation sheet ── */}
      <BottomSheet open={showDeleteSheet} onClose={() => setShowDeleteSheet(false)}>
        <div style={{ padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="text-title" style={{ color: 'var(--t1)', marginBottom: '6px' }}>Borrar todos los datos</h3>
            <p style={{ fontSize: '15px', color: 'var(--t3)', lineHeight: 1.6 }}>
              Esta acción elimina rachas, historial, objetivos y badges.<br/>No se puede deshacer.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            onClick={confirmDelete}
            style={{
              width: '100%', height: '54px', borderRadius: 'var(--r-lg)',
              background: 'rgba(255,59,48,0.10)',
              border: '0.5px solid rgba(255,59,48,0.35)',
              color: 'var(--red)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <Trash2 size={15} strokeWidth={2} />
            Borrar definitivamente
          </motion.button>
          <button
            onClick={() => setShowDeleteSheet(false)}
            style={{ background: 'none', border: 'none', color: 'var(--t4)', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} variant={toastVariant} />
    </PageWrapper>
  );
}
