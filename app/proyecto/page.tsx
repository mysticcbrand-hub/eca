'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Target } from 'lucide-react';
import { storage, Victory, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { staggerContainer, cardEntrance } from '@/lib/animations';

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

export default function ProyectoPage() {
  const [mounted, setMounted] = useState(false);
  const [projectMain, setProjectMain] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [goalDone, setGoalDone] = useState(false);
  const [victories, setVictories] = useState<Victory[]>([]);
  const [editingProject, setEditingProject] = useState(false);
  const projectRef = useRef<HTMLTextAreaElement>(null);
  const today = todayStr();

  useEffect(() => {
    setMounted(true);
    setProjectMain(storage.getProjectMain());
    setDailyGoal(storage.getDailyGoal(today));
    setVictories(storage.getVictories());
  }, [today]);

  const saveProject = useCallback(() => {
    storage.setProjectMain(projectMain);
    setEditingProject(false);
  }, [projectMain]);

  const saveDailyGoal = useCallback((text: string) => {
    setDailyGoal(text);
    storage.setDailyGoal(today, text);
  }, [today]);

  const markGoalDone = useCallback(() => {
    if (!dailyGoal.trim() || goalDone) return;
    setGoalDone(true);
    const v: Victory = { date: today, text: dailyGoal };
    storage.addVictory(v);
    setVictories(storage.getVictories());
  }, [dailyGoal, goalDone, today]);

  if (!mounted) return null;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#7A7A8C' }}>MI PROYECTO</span>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* What you're building */}
        <GlassCard level={2} animate style={{ padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#E2B96A' }}>CONSTRUYENDO</span>
            <button
              onClick={() => { setEditingProject(true); setTimeout(() => projectRef.current?.focus(), 50); }}
              aria-label="Editar proyecto"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3E3E52', padding: '2px' }}
            >
              <Edit2 size={16} />
            </button>
          </div>
          {editingProject ? (
            <textarea
              ref={projectRef}
              value={projectMain}
              onChange={e => setProjectMain(e.target.value)}
              onBlur={saveProject}
              placeholder="Un cuerpo. Una empresa. Una mente."
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.10)',
                color: '#EFEFF4', fontSize: 'clamp(18px,4vw,24px)',
                fontWeight: 600, letterSpacing: '-0.5px',
                outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.4,
                paddingBottom: '4px',
              }}
            />
          ) : (
            <p
              onClick={() => { setEditingProject(true); setTimeout(() => projectRef.current?.focus(), 50); }}
              style={{
                fontSize: 'clamp(18px,4vw,24px)', fontWeight: 600, letterSpacing: '-0.5px',
                color: projectMain ? '#EFEFF4' : '#3E3E52',
                lineHeight: 1.4, cursor: 'text', margin: 0,
              }}
            >
              {projectMain || 'Un cuerpo. Una empresa. Una mente.'}
            </p>
          )}
        </GlassCard>

        {/* Daily goal */}
        <GlassCard level={1} animate style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C' }}>HOY VOY A</span>
            {dailyGoal.trim() && !goalDone && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={markGoalDone}
                style={{
                  padding: '6px 14px', borderRadius: '9999px',
                  background: 'rgba(61,219,130,0.10)', border: '1px solid rgba(61,219,130,0.30)',
                  color: '#3DDB82', fontSize: '11px', fontWeight: 600, letterSpacing: '1px',
                  cursor: 'pointer',
                }}
              >
                Logrado
              </motion.button>
            )}
          </div>
          <input
            value={dailyGoal}
            onChange={e => saveDailyGoal(e.target.value)}
            placeholder="¿Qué es lo más importante que harás hoy?"
            disabled={goalDone}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              color: goalDone ? '#7A7A8C' : '#EFEFF4',
              fontSize: '15px', outline: 'none',
              textDecoration: goalDone ? 'line-through' : 'none',
              fontFamily: 'inherit',
              cursor: goalDone ? 'default' : 'text',
            }}
          />
        </GlassCard>

        {/* Victories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C' }}>VICTORIAS</span>
            <span style={{ fontSize: '13px', color: '#3E3E52' }}>{victories.length}</span>
          </div>

          {victories.length === 0 ? (
            <motion.div variants={cardEntrance} style={{ padding: '32px', textAlign: 'center' }}>
              <Target size={32} color="#262636" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '13px', color: '#262636', margin: 0 }}>Tus victorias aparecerán aquí.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {victories.map((v, i) => (
                <motion.div
                  key={`${v.date}-${i}`}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.04 }}
                  style={{
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                    padding: '14px 20px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#3E3E52', fontWeight: 600, whiteSpace: 'nowrap', paddingTop: '2px', letterSpacing: '0.5px' }}>
                    {formatDateLabel(v.date)}
                  </span>
                  <span style={{ fontSize: '15px', color: '#7A7A8C', lineHeight: 1.5 }}>{v.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
