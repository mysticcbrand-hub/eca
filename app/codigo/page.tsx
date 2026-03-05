'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, CheckCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { storage, Rule, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';
import { staggerContainer, cardEntrance, springs } from '@/lib/animations';
import { useHaptics } from '@/hooks/useHaptics';

// Minimal, focused, and smooth — Apple-level polish
export default function CodigoPage() {
  const [mounted,     setMounted    ] = useState(false);
  const [rules,       setRules      ] = useState<Rule[]>([]);
  const [checks,      setChecks     ] = useState<Record<string, boolean>>({});
  const [adding,      setAdding     ] = useState(false);
  const [newText,     setNewText    ] = useState('');
  const [editingId,   setEditingId  ] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Toast
  const [toastOn, setToastOn] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { vibrate } = useHaptics();

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
    vibrate(8);
  }, [today, vibrate]);

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
    vibrate(8);
  }, [newText, rules, vibrate]);

  const startEdit = useCallback((rule: Rule) => {
    setEditingId(rule.id);
    setEditingText(rule.text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) { setEditingId(null); setEditingText(''); return; }
    const next = rules.map(r => r.id === editingId ? { ...r, text } : r);
    storage.setRules(next);
    setRules(next);
    setEditingId(null);
    setEditingText('');
  }, [editingId, editingText, rules]);

  const moveRule = (id: string, dir: 'up'|'down') => {
    const idx = rules.findIndex(r => r.id === id);
    if (idx < 0) return;
    const j = dir === 'up' ? idx - 1 : idx + 1;
    if (j < 0 || j >= rules.length) return;
    const next = rules.slice();
    const [item] = next.splice(idx, 1);
    next.splice(j, 0, item);
    storage.setRules(next);
    setRules(next);
    vibrate(8);
  };

  const active  = rules.filter(r => r.enabled);
  const done    = active.filter(r => checks[r.id]).length;
  const total   = active.length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  // Quick templates (add fast if not present)
  const templates = useMemo(() => [
    'Sin dopamina barata antes de la noche',
    '-30min Redes',
    'Trabajar en mi proyecto',
  ], []);

  const canAddTemplate = (t: string) => !rules.some(r => r.text.toLowerCase() === t.toLowerCase());

  if (!mounted) return null;

  return (
    <PageWrapper glowState={allDone ? 'success' : 'neutral'}>

      {/* Header */}
      <div style={{ padding: '20px 20px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px' }}>REGLAS</span>
          <motion.span
            animate={{ color: pct === 100 ? 'var(--green)' : 'var(--t3)' }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}
          >
            {done}/{total} · {pct}%
          </motion.span>
        </div>
        <ProgressBar value={pct} height={3} shimmer={pct < 100} />
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        {/* Rules list */}
        <AnimatePresence>
          {rules.map(rule => {
            const isChecked = !!checks[rule.id];
            return (
              <motion.div
                key={rule.id}
                variants={cardEntrance}
                layout
                exit={{ opacity: 0, scale: 0.94, y: -4, transition: { duration: 0.2 } }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 14px', borderRadius: 'var(--r-lg)',
                  background: isChecked
                    ? 'linear-gradient(135deg, rgba(48,209,88,0.07) 0%, rgba(48,209,88,0.03) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  border: `0.5px solid ${isChecked ? 'rgba(48,209,88,0.18)' : 'rgba(255,255,255,0.08)'}`,
                  borderTopColor: isChecked ? 'rgba(48,209,88,0.28)' : 'rgba(255,255,255,0.14)',
                  boxShadow: isChecked
                    ? '0 0 0 0.5px rgba(48,209,88,0.08), 0 4px 16px rgba(0,0,0,0.3), 0 0 24px rgba(48,209,88,0.06)'
                    : 'var(--shadow-card)',
                  opacity: rule.enabled ? 1 : 0.45,
                  transition: 'border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <CustomCheckbox
                  checked={isChecked}
                  onChange={() => rule.enabled && toggleCheck(rule.id)}
                  size={26}
                />

                {editingId === rule.id ? (
                  <input
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') { setEditingId(null); setEditingText(''); }
                    }}
                    autoFocus
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: 'var(--t1)', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                ) : (
                  <span style={{
                    flex: 1, fontSize: '15px', lineHeight: 1.5, letterSpacing: '-0.01em',
                    color: isChecked ? 'var(--t3)' : 'var(--t1)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    fontWeight: isChecked ? 400 : 500,
                    transition: 'all 0.2s ease',
                  }}>
                    {rule.text}
                  </span>
                )}

                {/* Reorder + Edit controls */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    transition={springs.snappy}
                    onClick={() => moveRule(rule.id, 'up')}
                    aria-label="Subir"
                    style={{ background: 'none', border: 'none', color: 'var(--t4)', padding: 6, cursor: 'pointer' }}
                  >
                    <ArrowUp size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    transition={springs.snappy}
                    onClick={() => moveRule(rule.id, 'down')}
                    aria-label="Bajar"
                    style={{ background: 'none', border: 'none', color: 'var(--t4)', padding: 6, cursor: 'pointer' }}
                  >
                    <ArrowDown size={14} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    transition={springs.snappy}
                    onClick={() => startEdit(rule)}
                    aria-label="Editar"
                    style={{ background: 'none', border: 'none', color: 'var(--t4)', padding: 6, cursor: 'pointer' }}
                  >
                    <Pencil size={13} />
                  </motion.button>

                  {rule.custom && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      transition={springs.snappy}
                      onClick={() => deleteRule(rule.id)}
                      aria-label="Eliminar"
                      style={{ background: 'none', border: 'none', color: 'var(--t4)', padding: 6, cursor: 'pointer' }}
                    >
                      <X size={13} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* All Done banner */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springs.medium}
              className="glass-2"
              style={{ padding: '22px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CheckCheck size={18} color="var(--green)" strokeWidth={2} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', letterSpacing: '-0.02em' }}>
                  Código completo hoy.
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '6px', fontStyle: 'italic' }}>
                Eso es exactamente lo que tenías que hacer.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Rule */}
        {rules.length < 8 && (
          <AnimatePresence mode="wait">
            {adding ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '16px 18px', borderRadius: 'var(--r-lg)',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  border: '0.5px solid rgba(48,209,88,0.25)',
                  borderTopColor: 'rgba(48,209,88,0.40)',
                  boxShadow: '0 0 0 3px rgba(48,209,88,0.06)',
                  overflow: 'hidden',
                }}
              >
                <input
                  autoFocus
                  placeholder="Escribe tu propia regla..."
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addRule();
                    if (e.key === 'Escape') { setAdding(false); setNewText(''); }
                  }}
                  onBlur={addRule}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: 'var(--t1)', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                onClick={() => setAdding(true)}
                style={{
                  width: '100%', padding: '16px 18px', borderRadius: 'var(--r-lg)',
                  background: 'transparent',
                  border: '0.5px dashed var(--border-subtle)',
                  color: 'var(--t4)', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--t3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--t4)'; }}
              >
                <Plus size={15} strokeWidth={2} />
                Nueva regla
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* Quick templates */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {templates.map(t => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.95 }}
              transition={springs.snappy}
              disabled={!canAddTemplate(t)}
              onClick={() => { setNewText(t); addRule(); }}
              style={{
                padding: '6px 10px', borderRadius: 'var(--r-full)',
                background: canAddTemplate(t) ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: '0.5px solid var(--border-subtle)',
                color: canAddTemplate(t) ? 'var(--t2)' : 'var(--t4)',
                fontSize: 12, cursor: canAddTemplate(t) ? 'pointer' : 'default'
              }}
            >
              + {t}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <Toast message={toastMsg} visible={toastOn} onHide={() => setToastOn(false)} variant="success" />
    </PageWrapper>
  );
}
