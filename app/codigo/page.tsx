'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { storage, Rule, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { staggerContainer, cardEntrance } from '@/lib/animations';

export default function CodigoPage() {
  const [mounted, setMounted] = useState(false);
  const [rules, setRules]     = useState<Rule[]>([]);
  const [checks, setChecks]   = useState<Record<string, boolean>>({});
  const [adding, setAdding]   = useState(false);
  const [newText, setNewText] = useState('');
  const today = todayStr();

  useEffect(() => {
    setMounted(true);
    setRules(storage.getRules());
    setChecks(storage.getChecks(today));
  }, [today]);

  const toggleCheck = useCallback((id: string) => {
    setChecks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      storage.setChecks(today, next);
      return next;
    });
  }, [today]);

  const deleteRule = useCallback((id: string) => {
    const next = rules.filter(r => r.id !== id);
    storage.setRules(next);
    setRules(next);
  }, [rules]);

  const addRule = useCallback(() => {
    if (!newText.trim() || rules.length >= 8) { setAdding(false); setNewText(''); return; }
    const r: Rule = { id: Date.now().toString(), text: newText.trim(), enabled: true, custom: true };
    const next = [...rules, r];
    storage.setRules(next);
    setRules(next);
    setNewText('');
    setAdding(false);
  }, [newText, rules]);

  if (!mounted) return null;

  const active    = rules.filter(r => r.enabled);
  const done      = active.filter(r => checks[r.id]).length;
  const total     = active.length;
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone   = total > 0 && done === total;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '20px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '2.5px' }}>MI CÓDIGO</span>
          <span style={{ fontSize: '13px', color: pct === 100 ? '#3DDB82' : '#7A7A8C', fontWeight: 600, letterSpacing: '0.3px', transition: 'color 0.3s' }}>
            {done}/{total} · {pct}%
          </span>
        </div>
        <ProgressBar value={pct} height={3} shimmer={pct < 100} />
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: '9px' }}
      >
        <AnimatePresence>
          {rules.map(rule => (
            <motion.div
              key={rule.id}
              variants={cardEntrance}
              layout
              exit={{ opacity: 0, scale: 0.94, height: 0, transition: { duration: 0.22 } }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 18px', borderRadius: '18px',
                background: checks[rule.id]
                  ? 'linear-gradient(135deg, rgba(61,219,130,0.06) 0%, rgba(61,219,130,0.02) 100%)'
                  : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${checks[rule.id] ? 'rgba(61,219,130,0.14)' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: checks[rule.id]
                  ? '0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(61,219,130,0.06) inset'
                  : '0 4px 20px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.06) inset',
                transition: 'border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                opacity: rule.enabled ? 1 : 0.4,
              }}
            >
              <CustomCheckbox
                checked={!!checks[rule.id]}
                onChange={() => rule.enabled && toggleCheck(rule.id)}
                size={26}
              />
              <span style={{
                flex: 1, fontSize: '15px', lineHeight: 1.5,
                color: checks[rule.id] ? '#7A7A8C' : '#EFEFF4',
                textDecoration: checks[rule.id] ? 'line-through' : 'none',
                fontWeight: checks[rule.id] ? 400 : 500,
                transition: 'all 0.2s ease',
              }}>
                {rule.text}
              </span>
              {rule.custom && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteRule(rule.id)}
                  aria-label="Eliminar regla"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3E3E52', padding: '4px', borderRadius: '6px' }}
                >
                  <X size={14} strokeWidth={2} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* All done card */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{
                padding: '20px', borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(61,219,130,0.10) 0%, rgba(61,219,130,0.05) 100%)',
                border: '1px solid rgba(61,219,130,0.22)',
                boxShadow: '0 0 24px rgba(61,219,130,0.08)',
                textAlign: 'center',
                color: '#EFEFF4', fontSize: '15px', fontWeight: 500, letterSpacing: '-0.2px',
              }}
            >
              ✦&nbsp; Código completo hoy.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add rule */}
        {rules.length < 8 && (
          <AnimatePresence mode="wait">
            {adding ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '16px 18px', borderRadius: '18px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                }}
              >
                <input
                  autoFocus
                  placeholder="Escribe tu propia regla..."
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') { setAdding(false); setNewText(''); } }}
                  onBlur={addRule}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: '#EFEFF4', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAdding(true)}
                style={{
                  width: '100%', padding: '16px 18px', borderRadius: '18px',
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.09)',
                  color: '#3E3E52', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'border 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7A7A8C'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#3E3E52'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.09)'; }}
              >
                <Plus size={15} strokeWidth={2} /> Nueva regla
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </PageWrapper>
  );
}
