'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Plus, Check, ChevronRight } from 'lucide-react';
import { storage, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { staggerContainer, cardEntrance, springs } from '@/lib/animations';

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

export default function ProyectoPage() {
  const [mounted,        setMounted       ] = useState(false);
  const [project,        setProject       ] = useState('');
  const [editingProject, setEditingProject ] = useState(false);
  const [projectDraft,   setProjectDraft  ] = useState('');
  const [dailyGoal,      setDailyGoal     ] = useState('');
  const [goalDraft,      setGoalDraft     ] = useState('');
  const [editingGoal,    setEditingGoal   ] = useState(false);
  const [goalDone,       setGoalDone      ] = useState(false);
  const [victories,      setVictories     ] = useState<{ date: string; text: string }[]>([]);
  const today = todayStr();

  useEffect(() => {
    setMounted(true);
    setProject(storage.getProject());
    const g = storage.getDailyGoal(today);
    setDailyGoal(g?.text ?? '');
    setGoalDone(g?.done ?? false);
    setVictories(storage.getVictories());
  }, [today]);

  const saveProject = useCallback(() => {
    const t = projectDraft.trim();
    if (t) { storage.setProject(t); setProject(t); }
    setEditingProject(false);
    setProjectDraft('');
  }, [projectDraft]);

  const saveGoal = useCallback(() => {
    const t = goalDraft.trim();
    if (t) {
      storage.setDailyGoal(today, { text: t, done: false });
      setDailyGoal(t);
      setGoalDone(false);
    }
    setEditingGoal(false);
    setGoalDraft('');
  }, [goalDraft, today]);

  const markGoalDone = useCallback(() => {
    if (!dailyGoal || goalDone) return;
    storage.setDailyGoal(today, { text: dailyGoal, done: true });
    setGoalDone(true);
    const entry = { date: new Date().toISOString(), text: dailyGoal };
    const updated = [entry, ...victories].slice(0, 30);
    storage.setVictories(updated);
    setVictories(updated);
  }, [dailyGoal, goalDone, today, victories]);

  if (!mounted) return null;

  return (
    <PageWrapper glowState="neutral">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 10px' }}>
        <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px' }}>PROYECTO</span>
        <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '1px' }}>{today}</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >

        {/* ══════════════════════════════════
            PROYECTO PRINCIPAL
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance} className="glass-2" style={{ padding: '26px 24px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Label row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={15} color="var(--green)" strokeWidth={2} />
                <span className="text-label" style={{ color: 'var(--green)', letterSpacing: '2px' }}>PROYECTO</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={springs.snappy}
                onClick={() => { setEditingProject(true); setProjectDraft(project); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t2)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t4)')}
              >
                Editar
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {editingProject ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <textarea
                    autoFocus
                    value={projectDraft}
                    onChange={e => setProjectDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveProject(); }
                      if (e.key === 'Escape') setEditingProject(false);
                    }}
                    rows={3}
                    placeholder="¿En qué estás trabajando?"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', resize: 'none',
                      border: '0.5px solid rgba(48,209,88,0.30)', borderRadius: 'var(--r-md)',
                      padding: '12px 14px', color: 'var(--t1)', fontSize: '15px',
                      outline: 'none', fontFamily: 'inherit', lineHeight: 1.6,
                      boxShadow: '0 0 0 3px rgba(48,209,88,0.06)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={saveProject}
                      style={{
                        padding: '9px 18px', borderRadius: 'var(--r-full)',
                        background: 'rgba(48,209,88,0.14)',
                        border: '0.5px solid rgba(48,209,88,0.35)',
                        color: 'var(--green)', fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      Guardar
                    </motion.button>
                    <button onClick={() => setEditingProject(false)} style={{ background: 'none', border: 'none', color: 'var(--t4)', fontSize: '13px', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {project ? (
                    <p style={{
                      fontSize: 'clamp(18px,4.5vw,24px)', fontWeight: 700,
                      color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.3,
                    }}>
                      {project}
                    </p>
                  ) : (
                    <button
                      onClick={() => { setEditingProject(true); setProjectDraft(''); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--t4)', fontSize: '15px', textAlign: 'left', padding: 0,
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                    >
                      <Plus size={15} strokeWidth={2} />
                      Añade tu proyecto principal
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ══════════════════════════════════
            OBJETIVO DEL DÍA
        ══════════════════════════════════ */}
        <motion.div variants={cardEntrance} className="glass-1" style={{ padding: '22px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronRight size={14} color="var(--t3)" strokeWidth={2} />
              <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px' }}>HOY</span>
            </div>
            {dailyGoal && !goalDone && (
              <button
                onClick={() => { setEditingGoal(true); setGoalDraft(dailyGoal); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', fontSize: '12px', fontWeight: 600 }}
              >
                Cambiar
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {editingGoal ? (
              <motion.div key="edit-goal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <input
                  autoFocus
                  value={goalDraft}
                  onChange={e => setGoalDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveGoal();
                    if (e.key === 'Escape') setEditingGoal(false);
                  }}
                  onBlur={saveGoal}
                  placeholder="Una cosa que tienes que hacer hoy..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(48,209,88,0.28)',
                    borderRadius: 'var(--r-sm)', padding: '12px 14px',
                    color: 'var(--t1)', fontSize: '15px', outline: 'none',
                    fontFamily: 'inherit', boxShadow: '0 0 0 3px rgba(48,209,88,0.06)',
                  }}
                />
              </motion.div>
            ) : !dailyGoal ? (
              <motion.button
                key="add-goal"
                whileTap={{ scale: 0.97 }}
                onClick={() => { setEditingGoal(true); setGoalDraft(''); }}
                style={{
                  width: '100%', padding: '13px 0', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', color: 'var(--t4)', fontSize: '14px',
                }}
              >
                <Plus size={15} strokeWidth={2} />
                Añadir objetivo del día
              </motion.button>
            ) : (
              <motion.div key="show-goal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{
                  fontSize: '17px', fontWeight: 600, letterSpacing: '-0.02em',
                  color: goalDone ? 'var(--t3)' : 'var(--t1)',
                  textDecoration: goalDone ? 'line-through' : 'none',
                  marginBottom: '14px', transition: 'color 0.2s',
                }}>
                  {dailyGoal}
                </p>

                <AnimatePresence>
                  {!goalDone ? (
                    <motion.button
                      key="logrado"
                      whileHover={{ scale: 1.01, boxShadow: '0 0 0 1px rgba(48,209,88,0.4), 0 0 24px rgba(48,209,88,0.14)' }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      onClick={markGoalDone}
                      style={{
                        width: '100%', height: '50px', borderRadius: 'var(--r-lg)',
                        background: 'linear-gradient(135deg, rgba(48,209,88,0.16) 0%, rgba(48,209,88,0.08) 100%)',
                        border: '0.5px solid rgba(48,209,88,0.30)',
                        borderTopColor: 'rgba(48,209,88,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        color: 'var(--green)', fontSize: '11px', fontWeight: 700,
                        letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
                        boxShadow: '0 0 0 1px rgba(48,209,88,0.10), 0 0 16px rgba(48,209,88,0.08)',
                      }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                      Logrado
                    </motion.button>
                  ) : (
                    <motion.div
                      key="done-badge"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={springs.bouncy}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '12px', borderRadius: 'var(--r-lg)',
                        background: 'rgba(48,209,88,0.07)',
                        border: '0.5px solid rgba(48,209,88,0.20)',
                      }}
                    >
                      <Check size={14} color="var(--green)" strokeWidth={2.5} />
                      <span style={{ fontSize: '13px', color: 'var(--green-text)', fontWeight: 600 }}>
                        Completado hoy
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ══════════════════════════════════
            VICTORIAS
        ══════════════════════════════════ */}
        {victories.length > 0 && (
          <motion.div variants={cardEntrance}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={14} color="var(--gold-warm)" strokeWidth={2} />
                <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2px' }}>VICTORIAS</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--t4)', fontWeight: 600 }}>{victories.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <AnimatePresence>
                {victories.slice(0, 10).map((v, i) => (
                  <motion.div
                    key={v.date + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springs.medium, delay: i * 0.04 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '13px 16px', borderRadius: 'var(--r-md)',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      border: '0.5px solid var(--border-dim)',
                      borderTopColor: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Dot */}
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-warm)', flexShrink: 0, opacity: 0.8 }} />

                    <span style={{ flex: 1, fontSize: '14px', color: 'var(--t2)', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                      {v.text}
                    </span>

                    <span style={{ fontSize: '11px', color: 'var(--t4)', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                      {formatDate(v.date)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {victories.length > 10 && (
                <p style={{ fontSize: '12px', color: 'var(--t4)', textAlign: 'center', padding: '8px 0' }}>
                  +{victories.length - 10} más
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty state victorias */}
        {victories.length === 0 && (
          <motion.div
            variants={cardEntrance}
            style={{
              padding: '32px 20px', textAlign: 'center',
              border: '0.5px dashed var(--border-dim)', borderRadius: 'var(--r-lg)',
            }}
          >
            <Trophy size={24} color="var(--t4)" strokeWidth={1.5} style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px', color: 'var(--t4)', lineHeight: 1.6 }}>
              Tus victorias aparecerán aquí<br />cuando completes objetivos del día.
            </p>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
