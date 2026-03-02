'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, Rule } from '@/lib/storage';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { staggerContainer, cardEntrance, easeCustom, springs } from '@/lib/animations';
import { Plus, Check } from 'lucide-react';

const defaultRules: Rule[] = [
  { id: '1', text: 'Sin dopamina barata antes del mediodía', enabled: true, custom: false },
  { id: '2', text: 'Ante el impulso: esperar 10 minutos',   enabled: true, custom: false },
  { id: '3', text: 'Cada día, algo difícil',                enabled: true, custom: false },
];

const targetOptions = [
  'Pornografía',
  'Redes sociales',
  'YouTube infinito',
  'Videojuegos compulsivos',
  'Series / Netflix',
  'Otro',
];

/* ─── shared progress dots ─────────────────── */
function Dots({ active }: { active: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{
            width: i === active ? 24 : 6,
            background: i === active
              ? 'var(--green)'
              : i < active
                ? 'rgba(48,209,88,0.35)'
                : 'rgba(255,255,255,0.08)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ height: 5, borderRadius: 'var(--r-full)' }}
        />
      ))}
    </div>
  );
}

/* ─── Shared page shell ── */
function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--base)',
      display: 'flex', flexDirection: 'column',
      padding: 'env(safe-area-inset-top, 0px) 0 0',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow top */}
      <div style={{
        position: 'absolute', top: '-180px', left: '50%',
        transform: 'translateX(-50%)', width: '520px', height: '420px',
        background: 'radial-gradient(ellipse, rgba(10,132,255,0.08) 0%, rgba(48,209,88,0.06) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: 0.025, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Shared CTA button ── */
function CTAButton({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      animate={{ opacity: disabled ? 0.35 : 1 }}
      transition={{ duration: 0.2 }}
      whileHover={!disabled ? { scale: 1.01, boxShadow: '0 0 0 1px rgba(48,209,88,0.40), 0 0 32px rgba(48,209,88,0.18)' } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: '58px', borderRadius: 'var(--r-full)',
        background: 'linear-gradient(135deg, rgba(48,209,88,0.18) 0%, rgba(48,209,88,0.10) 50%, rgba(42,178,70,0.15) 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '0.5px solid rgba(48,209,88,0.35)',
        borderTopColor: 'rgba(48,209,88,0.50)',
        color: 'var(--green)', fontSize: '11px', fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: '0 0 0 1px rgba(48,209,88,0.12), 0 0 24px rgba(48,209,88,0.08), var(--shadow-button)',
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── STEP 0: Acceso ─────────────────────── */
function StepAcceso({ onNext }: { onNext: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    setCode(clean);
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (code === '1717') { onNext(); return; }
    setError('Código incorrecto');
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <OnboardingShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '320px', width: '100%', textAlign: 'center' }}
        >
          {/* Wordmark */}
          <motion.div variants={cardEntrance}>
            <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '4px' }}>ECA</span>
          </motion.div>

          {/* Card */}
          <motion.div
            variants={cardEntrance}
            animate={shake ? { x: [-8, 8, -6, 6, -3, 0] } : {}}
            transition={shake ? { duration: 0.4, ease: 'easeOut' } : undefined}
            className="glass-2"
            style={{ width: '100%', padding: '32px 24px' }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '3px', display: 'block', marginBottom: '12px' }}>
                ACCESO
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '22px' }}>
                Introduce el código
              </h2>
              <input
                value={code}
                onChange={e => handleChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                inputMode="numeric"
                type="password"
                autoComplete="one-time-code"
                autoFocus
                placeholder="••••"
                style={{
                  width: '100%', height: '56px', textAlign: 'center',
                  fontSize: '24px', letterSpacing: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `0.5px solid ${error ? 'rgba(255,59,48,0.40)' : 'rgba(255,255,255,0.14)'}`,
                  borderTopColor: error ? 'rgba(255,59,48,0.55)' : 'rgba(255,255,255,0.22)',
                  borderRadius: 'var(--r-md)', color: 'var(--t1)', outline: 'none',
                  fontWeight: 700, fontFamily: 'var(--font)',
                  boxShadow: error ? '0 0 0 3px rgba(255,59,48,0.08)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: '10px', fontSize: '13px', color: 'var(--red)', fontWeight: 500 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={cardEntrance} style={{ width: '100%' }}>
            <CTAButton onClick={handleSubmit} disabled={code.length < 4}>
              Continuar
            </CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </OnboardingShell>
  );
}

/* ─── STEP 1: Bienvenida ─────────────────── */
function StepBienvenida({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '320px', width: '100%', textAlign: 'center' }}
        >
          {/* Wordmark */}
          <motion.div variants={cardEntrance}>
            <motion.h1
              initial={{ filter: 'blur(12px)', opacity: 0, scale: 0.9 }}
              animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-green"
              style={{ fontSize: 'clamp(64px,18vw,90px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9 }}
            >
              ECA
            </motion.h1>
          </motion.div>

          <motion.p variants={cardEntrance} style={{ fontSize: '16px', color: 'var(--t3)', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            Tu mente. Reclamada.
          </motion.p>

          {/* Divider animado */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '48px', opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--green) 50%, transparent)',
              borderRadius: 'var(--r-full)',
            }}
          />

          <motion.p variants={cardEntrance} style={{ fontSize: '14px', color: 'var(--t4)', lineHeight: 1.7, maxWidth: '240px', letterSpacing: '-0.01em' }}>
            Un sistema frío y preciso para los que eligen construirse.
          </motion.p>

          <motion.div variants={cardEntrance} style={{ width: '100%', marginTop: '8px' }}>
            <CTAButton onClick={onNext}>Empezar</CTAButton>
          </motion.div>

          <motion.p variants={cardEntrance} className="text-label" style={{ color: 'var(--t4)', letterSpacing: '0.5px' }}>
            Sin cuenta · Sin suscripción · Solo tú
          </motion.p>
        </motion.div>
      </div>
    </OnboardingShell>
  );
}

/* ─── STEP 2: Enemigos ───────────────────── */
function StepEnemigos({ onNext }: { onNext: (targets: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  const toggle = (opt: string) => setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]);

  const handleContinue = () => {
    if (!selected.length) return;
    onNext(selected.map(t => (t === 'Otro' && otherText.trim()) ? otherText.trim() : t));
  };

  return (
    <OnboardingShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '56px 20px 0', overflowY: 'auto' }}>
        <Dots active={0} />

        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1 }}>
          <motion.p variants={cardEntrance} className="text-label" style={{ color: 'var(--t4)', marginBottom: '10px', letterSpacing: '2px' }}>
            PASO 1 DE 3
          </motion.p>
          <motion.h2 variants={cardEntrance} className="text-title" style={{ color: 'var(--t1)', marginBottom: '6px' }}>
            ¿Qué quieres eliminar?
          </motion.h2>
          <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: 'var(--t3)', marginBottom: '24px' }}>
            Sin juicios. Solo datos.
          </motion.p>

          <motion.div variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {targetOptions.map(opt => {
              const sel = selected.includes(opt);
              return (
                <motion.button
                  key={opt}
                  variants={cardEntrance}
                  whileTap={{ scale: 0.96 }}
                  transition={springs.snappy}
                  onClick={() => toggle(opt)}
                  style={{
                    padding: '14px', borderRadius: 'var(--r-lg)',
                    background: sel
                      ? 'linear-gradient(135deg, rgba(48,209,88,0.10) 0%, rgba(48,209,88,0.05) 100%)'
                      : 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: `0.5px solid ${sel ? 'rgba(48,209,88,0.30)' : 'rgba(255,255,255,0.08)'}`,
                    borderTopColor: sel ? 'rgba(48,209,88,0.45)' : 'rgba(255,255,255,0.12)',
                    color: sel ? 'var(--t1)' : 'var(--t3)',
                    fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    textAlign: 'left',
                    boxShadow: sel ? '0 0 0 1px rgba(48,209,88,0.10), 0 0 16px rgba(48,209,88,0.08)' : 'var(--shadow-card)',
                    transition: 'background 0.18s ease, border-color 0.18s ease, color 0.18s ease',
                    fontWeight: sel ? 600 : 400,
                  }}
                >
                  <AnimatePresence>
                    {sel && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      >
                        <Check size={12} color="var(--green)" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {opt}
                </motion.button>
              );
            })}
          </motion.div>

          <AnimatePresence>
            {selected.includes('Otro') && (
              <motion.input
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 50, marginTop: 10 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                placeholder="¿Cuál es tu enemigo?"
                value={otherText}
                onChange={e => setOtherText(e.target.value)}
                style={{
                  display: 'block', width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '0.5px solid rgba(48,209,88,0.25)', borderRadius: 'var(--r-md)',
                  padding: '0 16px', color: 'var(--t1)', fontSize: '15px', outline: 'none',
                  fontFamily: 'inherit', boxShadow: '0 0 0 3px rgba(48,209,88,0.06)',
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selected.length > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ marginTop: '14px', fontSize: '13px', color: 'var(--green-text)', fontWeight: 600 }}
              >
                {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div style={{
        padding: '16px 20px calc(16px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, var(--base) 65%, transparent)',
      }}>
        <CTAButton onClick={handleContinue} disabled={selected.length === 0}>Continuar</CTAButton>
      </div>
    </OnboardingShell>
  );
}

/* ─── STEP 3: Reglas ─────────────────────── */
function StepReglas({ onNext }: { onNext: (rules: Rule[]) => void }) {
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [newRuleText, setNewRuleText] = useState('');
  const [addingRule, setAddingRule] = useState(false);

  const addRule = () => {
    if (!newRuleText.trim() || rules.length >= 8) { setAddingRule(false); return; }
    const r: Rule = { id: Date.now().toString(), text: newRuleText.trim(), enabled: true, custom: true };
    setRules(prev => [...prev, r]);
    setNewRuleText('');
    setAddingRule(false);
  };

  return (
    <OnboardingShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '56px 20px 0', overflowY: 'auto' }}>
        <Dots active={1} />

        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.p variants={cardEntrance} className="text-label" style={{ color: 'var(--t4)', marginBottom: '10px', letterSpacing: '2px' }}>
            PASO 2 DE 3
          </motion.p>
          <motion.h2 variants={cardEntrance} className="text-title" style={{ color: 'var(--t1)', marginBottom: '4px' }}>
            Define tu código.
          </motion.h2>
          <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: 'var(--t3)', marginBottom: '16px' }}>
            Solo tú lo verás. Solo tú lo cumplirás.
          </motion.p>

          <AnimatePresence>
            {rules.map(rule => (
              <motion.div
                key={rule.id}
                variants={cardEntrance}
                layout
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '15px 18px', borderRadius: 'var(--r-lg)',
                  background: rule.enabled
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  border: `0.5px solid ${rule.enabled ? 'rgba(48,209,88,0.14)' : 'rgba(255,255,255,0.06)'}`,
                  borderTopColor: rule.enabled ? 'rgba(48,209,88,0.24)' : 'rgba(255,255,255,0.10)',
                  transition: 'border 0.2s ease, background 0.2s ease',
                }}
              >
                <ToggleSwitch
                  checked={rule.enabled}
                  onChange={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                  label={rule.text}
                />
                <span style={{ flex: 1, fontSize: '15px', color: rule.enabled ? 'var(--t1)' : 'var(--t3)', lineHeight: 1.4, letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
                  {rule.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {rules.length < 8 && (
            <AnimatePresence mode="wait">
              {addingRule ? (
                <motion.div
                  key="inp"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '15px 18px', borderRadius: 'var(--r-lg)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(48,209,88,0.28)',
                    boxShadow: '0 0 0 3px rgba(48,209,88,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <input
                    autoFocus
                    placeholder="Tu propia regla..."
                    value={newRuleText}
                    onChange={e => setNewRuleText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') setAddingRule(false); }}
                    onBlur={addRule}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--t1)', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAddingRule(true)}
                  style={{
                    width: '100%', padding: '15px 18px', borderRadius: 'var(--r-lg)',
                    background: 'transparent', border: '0.5px dashed var(--border-subtle)',
                    color: 'var(--t4)', fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  <Plus size={14} strokeWidth={2} /> Añadir mi regla
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <div style={{
        padding: '16px 20px calc(16px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, var(--base) 65%, transparent)',
      }}>
        <CTAButton onClick={() => onNext(rules)}>Continuar</CTAButton>
      </div>
    </OnboardingShell>
  );
}

/* ─── STEP 4: Compromiso ─────────────────── */
function StepCompromiso({ onFinish }: { onFinish: () => void }) {
  const [show01, setShow01] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow01(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <OnboardingShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <Dots active={2} />

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={easeCustom}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', width: '100%', maxWidth: '320px' }}
        >
          {/* PASO 3 label */}
          <span className="text-label" style={{ color: 'var(--t4)', letterSpacing: '2px' }}>PASO 3 DE 3</span>

          {/* Big number — flip animation */}
          <div style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              {!show01 ? (
                <motion.div
                  key="00"
                  exit={{ rotateX: 90, opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: 'clamp(88px,24vw,130px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.85, color: 'var(--t4)' }}
                >
                  00
                </motion.div>
              ) : (
                <motion.div
                  key="01"
                  initial={{ rotateX: -90, opacity: 0, y: 20 }}
                  animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="text-gradient-green"
                  style={{
                    fontSize: 'clamp(88px,24vw,130px)', fontWeight: 800,
                    letterSpacing: '-0.06em', lineHeight: 0.85,
                    filter: 'drop-shadow(0 0 40px rgba(48,209,88,0.25))',
                  }}
                >
                  01
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p style={{ fontSize: '16px', color: 'var(--t2)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            Tu primer día empieza ahora.
          </p>

          <div className="divider" style={{ width: '40px' }} />

          <p style={{ fontSize: '14px', color: 'var(--t4)', maxWidth: '240px', lineHeight: 1.8, fontStyle: 'italic' }}>
            No hay app que cambie nada.<br />
            Solo las decisiones que tomas cada día.
          </p>

          <div style={{ width: '100%', marginTop: '8px' }}>
            <CTAButton onClick={onFinish}>Comenzar mi sistema</CTAButton>
          </div>
        </motion.div>
      </div>
    </OnboardingShell>
  );
}

/* ─── ROOT ───────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleFinish = () => {
    storage.setOnboarded();
    storage.setStartDate(new Date().toISOString());
    storage.setStreak(0);
    storage.setBestStreak(0);
    storage.setTotalDays(0);
    router.replace('/');
  };

  return (
    /* Onboarding takes full screen — no nav, no shell padding */
    <div style={{ position: 'fixed', inset: 0, background: 'var(--base)', zIndex: 200, overflowY: 'auto', overflowX: 'hidden' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={easeCustom}>
            <StepAcceso onNext={() => setStep(1)} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={easeCustom}>
            <StepBienvenida onNext={() => setStep(2)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={easeCustom}>
            <StepEnemigos onNext={targets => { storage.setTargets(targets); setStep(3); }} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={easeCustom}>
            <StepReglas onNext={rules => { storage.setRules(rules); setStep(4); }} />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={easeCustom}>
            <StepCompromiso onFinish={handleFinish} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
