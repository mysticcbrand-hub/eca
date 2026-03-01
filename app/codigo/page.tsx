'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil } from 'lucide-react';
import { storage, Rule, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { staggerContainer, cardEntrance } from '@/lib/animations';
import { badgeDefinitions, evaluateBadges, BadgeRarity, BadgeDefinition } from '@/lib/badges';
import { BadgeToast } from '@/components/ui/BadgeToast';

const rarityStyles: Record<BadgeRarity, { label: string; color: string; border: string; glow?: string; } > = {
  common: { label: 'COMÚN', color: '#7A7A8C', border: 'rgba(255,255,255,0.08)' },
  rare: { label: 'RARO', color: '#3DDB82', border: 'rgba(61,219,130,0.25)', glow: '0 0 18px rgba(61,219,130,0.15)' },
  epic: { label: 'ÉPICO', color: '#7B6CFF', border: 'rgba(123,108,255,0.35)', glow: '0 0 18px rgba(123,108,255,0.20)' },
  legendary: { label: 'LEGENDARIO', color: '#E2B96A', border: 'rgba(226,185,106,0.35)', glow: '0 0 22px rgba(226,185,106,0.30)' },
};

export default function CodigoPage() {
  const [mounted, setMounted] = useState(false);
  const [rules, setRules]     = useState<Rule[]>([]);
  const [checks, setChecks]   = useState<Record<string, boolean>>({});
  const [adding, setAdding]   = useState(false);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [badgeQueue, setBadgeQueue] = useState<BadgeDefinition[]>([]);
  const [activeBadge, setActiveBadge] = useState<BadgeDefinition | null>(null);
  const [badgeVisible, setBadgeVisible] = useState(false);
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

  const active    = rules.filter(r => r.enabled);
  const done      = active.filter(r => checks[r.id]).length;
  const total     = active.length;
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone   = total > 0 && done === total;

  const badgeStats = useMemo(() => ({
    streak: storage.getStreak(),
    bestStreak: storage.getBestStreak(),
    totalDays: storage.getTotalDays(),
    relapses: storage.getRelapses().length,
    victories: storage.getVictories().length,
    rulesCompletedToday: done,
    rulesTotalToday: total,
  }), [done, total]);

  const unlocked = useMemo(() => new Set(evaluateBadges(badgeStats)), [badgeStats]);

  // Badge unlock notifications
  useEffect(() => {
    const previous = new Set(storage.getBadgesUnlocked());
    const current = Array.from(unlocked);
    const newlyUnlocked = current.filter(id => !previous.has(id));

    // First run without prior key: set current without notifications
    if (!storage.hasBadgesUnlocked() && current.length > 0) {
      storage.setBadgesUnlocked(current);
      return;
    }

    if (newlyUnlocked.length > 0) {
      const newBadges = badgeDefinitions.filter(b => newlyUnlocked.includes(b.id));
      setBadgeQueue(prev => [...prev, ...newBadges]);
      storage.setBadgesUnlocked(Array.from(new Set([...current, ...Array.from(previous)])));
    }
  }, [unlocked]);

  useEffect(() => {
    if (badgeVisible || activeBadge || badgeQueue.length === 0) return;
    const next = badgeQueue[0];
    setActiveBadge(next);
    setBadgeVisible(true);
  }, [badgeQueue, badgeVisible, activeBadge]);

  const hideBadgeToast = () => {
    setBadgeVisible(false);
    setActiveBadge(null);
    setBadgeQueue(prev => prev.slice(1));
  };

  if (!mounted) return null;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '20px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '2.5px' }}>REGLAS</span>
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
                opacity: rule.enabled ? 1 : 0.5,
              }}
            >
              <CustomCheckbox
                checked={!!checks[rule.id]}
                onChange={() => rule.enabled && toggleCheck(rule.id)}
                size={26}
              />

              {/* Text or edit input */}
              {editingId === rule.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') { setEditingId(null); setEditingText(''); }
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#EFEFF4',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <span style={{
                  flex: 1, fontSize: '15px', lineHeight: 1.5,
                  color: checks[rule.id] ? '#7A7A8C' : '#EFEFF4',
                  textDecoration: checks[rule.id] ? 'line-through' : 'none',
                  fontWeight: checks[rule.id] ? 400 : 500,
                  transition: 'all 0.2s ease',
                }}>
                  {rule.text}
                </span>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(rule)}
                  aria-label="Editar regla"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3E3E52', padding: '4px', borderRadius: '6px' }}
                >
                  <Pencil size={14} strokeWidth={2} />
                </motion.button>
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
              </div>
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
              >
                <Plus size={15} strokeWidth={2} /> Nueva regla
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* ── Badges grid ── */}
        <motion.div variants={cardEntrance} style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-label" style={{ color: '#7A7A8C', letterSpacing: '2.2px' }}>BADGES</span>
            <span style={{ fontSize: '12px', color: '#3E3E52' }}>{unlocked.size}/{badgeDefinitions.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {badgeDefinitions.map((b) => {
              const isUnlocked = unlocked.has(b.id);
              const rarity = rarityStyles[b.rarity];
              return (
                <div
                  key={b.id}
                  className={b.rarity === 'legendary' ? 'legendary-shine' : ''}
                  style={{
                    padding: '12px', borderRadius: '14px',
                    background: isUnlocked
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${rarity.border}`,
                    boxShadow: rarity.glow ?? 'none',
                    opacity: isUnlocked ? 1 : 0.45,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontSize: '16px', color: rarity.color, fontWeight: 700,
                      }}
                    >
                      {b.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#EFEFF4', letterSpacing: '-0.2px' }}>{b.name}</div>
                      <div style={{ fontSize: '9px', color: rarity.color, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>{rarity.label}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#7A7A8C', lineHeight: 1.4, marginTop: '8px' }}>{b.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <BadgeToast badge={activeBadge} visible={badgeVisible} onHide={hideBadgeToast} />
    </PageWrapper>
  );
}
