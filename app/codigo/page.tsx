'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, CheckCheck } from 'lucide-react';
import { storage, Rule, todayStr } from '@/lib/storage';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { staggerContainer, cardEntrance, springs } from '@/lib/animations';
import { BADGE_DEFINITIONS, computeBadges, type BadgeDefinition } from '@/lib/badges';
import { BadgeToast } from '@/components/ui/BadgeToast';

/* ── Rarity visual system ───────────────── */
type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
const rarityConfig: Record<BadgeRarity, {
  label: string; color: string; border: string;
  bg: string; glow?: string; textGlow?: string;
}> = {
  common: {
    label: 'COMÚN',
    color: 'var(--t3)',
    border: 'var(--border-dim)',
    bg: 'rgba(255,255,255,0.03)',
  },
  rare: {
    label: 'RARO',
    color: 'var(--green-text)',
    border: 'rgba(48,209,88,0.22)',
    bg: 'rgba(48,209,88,0.06)',
    glow: '0 0 16px rgba(48,209,88,0.12)',
    textGlow: 'var(--green-text)',
  },
  epic: {
    label: 'ÉPICO',
    color: '#7B6CFF',
    border: 'rgba(123,108,255,0.30)',
    bg: 'rgba(123,108,255,0.07)',
    glow: '0 0 18px rgba(123,108,255,0.14)',
  },
  legendary: {
    label: 'LEGENDARIO',
    color: 'var(--gold-warm)',
    border: 'rgba(232,184,75,0.32)',
    bg: 'rgba(232,184,75,0.07)',
    glow: '0 0 22px rgba(232,184,75,0.20)',
  },
};

export default function CodigoPage() {
  const [mounted,     setMounted    ] = useState(false);
  const [rules,       setRules      ] = useState<Rule[]>([]);
  const [checks,      setChecks     ] = useState<Record<string, boolean>>({});
  const [adding,      setAdding     ] = useState(false);
  const [newText,     setNewText    ] = useState('');
  const [editingId,   setEditingId  ] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [badgeQueue,  setBadgeQueue ] = useState<BadgeDefinition[]>([]);
  const [activeBadge, setActiveBadge] = useState<BadgeDefinition | null>(null);
  const [badgeVisible,setBadgeVisible] = useState(false);
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

  const active  = rules.filter(r => r.enabled);
  const done    = active.filter(r => checks[r.id]).length;
  const total   = active.length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const unlocked = useMemo(() => {
    if (typeof window === 'undefined') return new Set<string>();
    const badges = computeBadges({
      streak:      storage.getStreak(),
      bestStreak:  storage.getBestStreak(),
      totalDays:   storage.getTotalDays(),
      relapses:    storage.getRelapses(),
      victories:   storage.getVictories(),
      rules,
      checks,
      isComeback:      false,
      comebackStreak:  0,
      unlockedBadgeHistory: storage.getUnlockedBadgeHistory?.() ?? {},
    });
    return new Set(badges.filter(b => b.status === 'unlocked').map(b => b.id));
  }, [rules, checks]);

  useEffect(() => {
    const previous = new Set(storage.getBadgesUnlocked());
    const current  = Array.from(unlocked);
    const newlyUnlocked = current.filter(id => !previous.has(id));
    if (!storage.hasBadgesUnlocked() && current.length > 0) {
      storage.setBadgesUnlocked(current);
      return;
    }
    if (newlyUnlocked.length > 0) {
      const newBadges = BADGE_DEFINITIONS.filter(b => newlyUnlocked.includes(b.id));
      setBadgeQueue(prev => [...prev, ...newBadges]);
      storage.setBadgesUnlocked(Array.from(new Set([...current, ...Array.from(previous)])));
    }
  }, [unlocked]);

  useEffect(() => {
    if (badgeVisible || activeBadge || badgeQueue.length === 0) return;
    setActiveBadge(badgeQueue[0]);
    setBadgeVisible(true);
  }, [badgeQueue, badgeVisible, activeBadge]);

  const hideBadgeToast = () => {
    setBadgeVisible(false);
    setActiveBadge(null);
    setBadgeQueue(prev => prev.slice(1));
  };

  if (!mounted) return null;

  return (
    <PageWrapper glowState={allDone ? 'success' : 'neutral'}>

      {/* ── Header ── */}
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

        {/* ── Reglas ── */}
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
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px 18px', borderRadius: 'var(--r-lg)',
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

                <div style={{ display: 'flex', gap: '4px' }}>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    transition={springs.snappy}
                    onClick={() => startEdit(rule)}
                    aria-label="Editar"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--t4)', padding: '6px', borderRadius: 'var(--r-sm)',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--t2)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--t4)')}
                  >
                    <Pencil size={13} strokeWidth={2} />
                  </motion.button>
                  {rule.custom && (
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      transition={springs.snappy}
                      onClick={() => deleteRule(rule.id)}
                      aria-label="Eliminar"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--t4)', padding: '6px', borderRadius: 'var(--r-sm)',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--t4)')}
                    >
                      <X size={13} strokeWidth={2} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ── All Done banner ── */}
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

        {/* ── Añadir regla ── */}
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

        {/* ─────────────────────────────────────
            BADGES
        ───────────────────────────────────── */}
        <motion.div variants={cardEntrance} style={{ marginTop: '16px' }}>

          {/* Sección header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 2px' }}>
            <span className="text-label" style={{ color: 'var(--t3)', letterSpacing: '2.5px' }}>BADGES</span>
            <span style={{ fontSize: '12px', color: 'var(--t4)', fontWeight: 600 }}>
              {unlocked.size}/{BADGE_DEFINITIONS.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {BADGE_DEFINITIONS.map(b => {
              const isUnlocked = unlocked.has(b.id);
              const cfg = rarityConfig[(b.rarity ?? 'common') as BadgeRarity];

              return (
                <motion.div
                  key={b.id}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  transition={springs.snappy}
                  className={b.rarity === 'legendary' && isUnlocked ? 'legendary-shine' : ''}
                  style={{
                    padding: '13px', borderRadius: 'var(--r-lg)',
                    background: isUnlocked ? cfg.bg : 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: `0.5px solid ${isUnlocked ? cfg.border : 'var(--border-dim)'}`,
                    borderTopColor: isUnlocked ? cfg.border : 'var(--border-dim)',
                    boxShadow: isUnlocked ? (cfg.glow ?? 'var(--shadow-card)') : 'none',
                    opacity: isUnlocked ? 1 : 0.4,
                    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Shimmer al desbloquear */}
                  {isUnlocked && <div className="milestone-unlocked" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }} />}

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 'var(--r-md)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isUnlocked ? `rgba(255,255,255,0.07)` : 'rgba(255,255,255,0.03)',
                      border: `0.5px solid ${isUnlocked ? cfg.border : 'var(--border-dim)'}`,
                      fontSize: '16px',
                      boxShadow: isUnlocked && cfg.glow ? cfg.glow : 'none',
                      flexShrink: 0,
                    }}>
                      {b.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 700, color: isUnlocked ? 'var(--t1)' : 'var(--t4)',
                        letterSpacing: '-0.02em', lineHeight: 1.2,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {b.name}
                      </div>
                      <div style={{
                        fontSize: '9px', color: isUnlocked ? cfg.color : 'var(--t4)',
                        letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px', fontWeight: 700,
                      }}>
                        {cfg.label}
                      </div>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '11px', color: isUnlocked ? 'var(--t3)' : 'var(--t4)',
                    lineHeight: 1.4, marginTop: '9px', position: 'relative', zIndex: 1,
                  }}>
                    {b.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <BadgeToast badge={activeBadge} visible={badgeVisible} onHide={hideBadgeToast} />
    </PageWrapper>
  );
}
