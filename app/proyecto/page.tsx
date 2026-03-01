'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Target, ChevronRight } from 'lucide-react';
import { storage, Victory, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { staggerContainer, cardEntrance } from '@/lib/animations';

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

export default function ProyectoPage() {
  const [mounted, setMounted]           = useState(false);
  const [projectMain, setProjectMain]   = useState('');
  const [dailyGoal, setDailyGoal]       = useState('');
  const [goalDone, setGoalDone]         = useState(false);
  const [victories, setVictories]       = useState<Victory[]>([]);
  const [editingProject, setEditingProject] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleGoalChange = useCallback((text: string) => {
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
      <div style={{ padding: '20px 20px 4px' }}>
        <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '2.5px' }}>MI PROYECTO</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {/* ── What you're building ── */}
        <motion.div
          variants={cardEntrance}
          style={{
            padding: '24px', borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 48px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="text-label" style={{ color: '#E2B96A', letterSpacing: '1.8px' }}>CONSTRUYENDO</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setEditingProject(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
              aria-label="Editar proyecto"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', cursor: 'pointer', padding: '6px 8px', color: '#7A7A8C' }}
            >
              <Edit2 size={13} strokeWidth={2} />
            </motion.button>
          </div>

          {editingProject ? (
            <textarea
              ref={textareaRef}
              value={projectMain}
              onChange={e => setProjectMain(e.target.value)}
              onBlur={saveProject}
              placeholder="Un cuerpo. Una empresa. Una mente."
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                color: '#EFEFF4', fontSize: 'clamp(17px,4.5vw,22px)',
                fontWeight: 600, letterSpacing: '-0.5px',
                outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                paddingBottom: '6px',
              }}
            />
          ) : (
            <p
              onClick={() => { setEditingProject(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
              style={{
                fontSize: 'clamp(17px,4.5vw,22px)', fontWeight: 600, letterSpacing: '-0.5px',
                color: projectMain ? '#EFEFF4' : '#3E3E52', lineHeight: 1.4, cursor: 'text',
              }}
            >
              {projectMain || 'Un cuerpo. Una empresa. Una mente.'}
            </p>
          )}
        </motion.div>

        {/* ── Daily goal ── */}
        <motion.div
          variants={cardEntrance}
          style={{
            padding: '20px 22px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '1.8px' }}>HOY VOY A</span>
            {dailyGoal.trim() && !goalDone && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={markGoalDone}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 14px', borderRadius: '9999px',
                  background: 'rgba(61,219,130,0.10)', border: '1px solid rgba(61,219,130,0.28)',
                  color: '#3DDB82', fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                  cursor: 'pointer',
                }}
              >
                Logrado <ChevronRight size={12} strokeWidth={2.5} />
              </motion.button>
            )}
          </div>
          <input
            value={dailyGoal}
            onChange={e => handleGoalChange(e.target.value)}
            placeholder="¿Qué es lo más importante que harás hoy?"
            disabled={goalDone}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              color: goalDone ? '#7A7A8C' : '#EFEFF4', fontSize: '15px',
              outline: 'none', textDecoration: goalDone ? 'line-through' : 'none',
              fontFamily: 'inherit', fontWeight: goalDone ? 400 : 500,
              cursor: goalDone ? 'default' : 'text',
            }}
          />
        </motion.div>

        {/* ── Victories ── */}
        <motion.div variants={cardEntrance}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px', marginBottom: '10px' }}>
            <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '1.8px' }}>VICTORIAS</span>
            {victories.length > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '9999px', background: 'rgba(226,185,106,0.08)',
                border: '1px solid rgba(226,185,106,0.18)', color: '#E2B96A', letterSpacing: '0.5px',
              }}>
                {victories.length}
              </span>
            )}
          </div>

          {victories.length === 0 ? (
            <div style={{
              padding: '36px 20px', textAlign: 'center', borderRadius: '18px',
              background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)',
            }}>
              <Target size={28} color="#262636" style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontSize: '13px', color: '#262636' }}>Tus victorias aparecerán aquí.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatePresence>
                {victories.map((v, i) => (
                  <motion.div
                    key={`${v.date}-${i}`}
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32, delay: i * 0.04 }}
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '14px 18px', borderRadius: '16px',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span style={{
                      fontSize: '10px', color: '#3E3E52', fontWeight: 700,
                      whiteSpace: 'nowrap', paddingTop: '3px', letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                    }}>
                      {fmtDate(v.date)}
                    </span>
                    <span style={{ fontSize: '14px', color: '#EFEFF4', lineHeight: 1.5, fontWeight: 400 }}>{v.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
