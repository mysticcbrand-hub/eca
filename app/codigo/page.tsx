'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { storage, Rule, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { staggerContainer, cardEntrance } from '@/lib/animations';

export default function CodigoPage() {
  const [mounted, setMounted] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [addingRule, setAddingRule] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');
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

  const toggleRuleEnabled = useCallback((id: string) => {
    setRules(prev => {
      const next = prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
      storage.setRules(next);
      return next;
    });
  }, []);

  const addRule = useCallback(() => {
    if (!newRuleText.trim() || rules.length >= 8) return;
    const newRule: Rule = { id: Date.now().toString(), text: newRuleText.trim(), enabled: true, custom: true };
    const next = [...rules, newRule];
    storage.setRules(next);
    setRules(next);
    setNewRuleText('');
    setAddingRule(false);
  }, [newRuleText, rules]);

  const deleteRule = useCallback((id: string) => {
    const next = rules.filter(r => r.id !== id);
    storage.setRules(next);
    setRules(next);
  }, [rules]);

  if (!mounted) return null;

  const activeRules = rules.filter(r => r.enabled);
  const completedCount = activeRules.filter(r => checks[r.id]).length;
  const total = activeRules.length;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;
  const allDone = total > 0 && completedCount === total;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#7A7A8C' }}>MI CÓDIGO</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#7A7A8C' }}>
              {completedCount} / {total} completadas hoy
            </span>
            <span style={{ fontSize: '13px', color: '#3DDB82', fontWeight: 600 }}>
              {total > 0 ? Math.round(progress) : 0}%
            </span>
          </div>
          <ProgressBar value={progress} height={3} shimmer={progress < 100} />
        </div>
      </div>

      {/* Rules list */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <AnimatePresence>
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              variants={cardEntrance}
              layout
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 20px', borderRadius: '20px',
                background: checks[rule.id] ? 'rgba(61,219,130,0.04)' : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${checks[rule.id] ? 'rgba(61,219,130,0.15)' : 'rgba(255,255,255,0.08)'}`,
                transition: 'border 0.2s ease, background 0.2s ease',
                opacity: rule.enabled ? 1 : 0.4,
              }}
            >
              {rule.enabled ? (
                <CustomCheckbox
                  checked={!!checks[rule.id]}
                  onChange={() => toggleCheck(rule.id)}
                  size={28}
                />
              ) : (
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ToggleSwitch checked={false} onChange={() => toggleRuleEnabled(rule.id)} label={rule.text} />
                </div>
              )}
              <span style={{
                flex: 1, fontSize: '15px', lineHeight: 1.5,
                color: checks[rule.id] ? '#7A7A8C' : '#EFEFF4',
                textDecoration: checks[rule.id] ? 'line-through' : 'none',
                transition: 'all 0.2s ease',
              }}>
                {rule.text}
              </span>
              {rule.custom && (
                <button
                  onClick={() => deleteRule(rule.id)}
                  aria-label="Eliminar regla"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#3E3E52' }}
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* All done card */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                padding: '20px', borderRadius: '20px',
                background: 'rgba(61,219,130,0.08)',
                border: '1px solid rgba(61,219,130,0.20)',
                textAlign: 'center',
                color: '#EFEFF4', fontSize: '15px',
              }}
            >
              ✦ Código completo hoy.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add rule button */}
        {rules.length < 8 && (
          <AnimatePresence mode="wait">
            {addingRule ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '16px 20px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  overflow: 'hidden',
                }}
              >
                <input
                  autoFocus
                  placeholder="Escribe tu propia regla..."
                  value={newRuleText}
                  onChange={e => setNewRuleText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') setAddingRule(false); }}
                  onBlur={addRule}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: '#EFEFF4', fontSize: '15px', outline: 'none',
                  }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setAddingRule(true)}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '20px',
                  background: 'transparent', border: '1px dashed rgba(255,255,255,0.10)',
                  color: '#7A7A8C', fontSize: '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}
              >
                <Plus size={16} />
                Nueva regla
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </PageWrapper>
  );
}
