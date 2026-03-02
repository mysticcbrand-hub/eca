'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, Rule } from '@/lib/storage';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { staggerContainer, cardEntrance, easeCustom } from '@/lib/animations';
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
          animate={{ width: i === active ? 20 : 6, background: i === active ? '#3DDB82' : 'rgba(255,255,255,0.10)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ height: 6, borderRadius: 9999 }}
        />
      ))}
    </div>
  );
}

/* ─── STEP 0: Acceso ─────────────────────── */
function StepAcceso({ onNext }: { onNext: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    setCode(clean);
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (code === '1717') {
      onNext();
      return;
    }
    setError('Código inválido');
  };

  return (
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 28px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-160px', left: '50%',
        transform: 'translateX(-50%)', width: '520px', height: '380px',
        background: 'radial-gradient(ellipse, rgba(77,158,255,0.12) 0%, rgba(61,219,130,0.08) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', maxWidth: '320px', width: '100%', textAlign: 'center' }}
      >
        <motion.div variants={cardEntrance} style={{
          padding: '26px 24px', borderRadius: '22px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          width: '100%',
        }}>
          <p style={{ fontSize: '11px', color: '#3E3E52', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Acceso
          </p>
          <h2 className="text-title" style={{ color: '#EFEFF4', fontSize: '22px', marginBottom: '12px' }}>
            Introduce el código
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              value={code}
              onChange={e => handleChange(e.target.value)}
              inputMode="numeric"
              type="password"
              autoComplete="one-time-code"
              placeholder="••••"
              style={{
                width: '160px', height: '54px', textAlign: 'center',
                fontSize: '20px', letterSpacing: '10px',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${error ? 'rgba(255,77,77,0.35)' : 'rgba(255,255,255,0.14)'}`,
                borderRadius: '14px', color: '#EFEFF4', outline: 'none',
                fontWeight: 600,
              }}
            />
          </div>
          {error && (
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#FF4D4D' }}>{error}</p>
          )}
        </motion.div>

        <motion.button
          variants={cardEntrance}
          whileHover={{ scale: 1.02, boxShadow: '0 0 0 1px rgba(61,219,130,0.4), 0 0 28px rgba(61,219,130,0.18)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          style={{
            marginTop: '4px', width: '100%', height: '56px', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(61,219,130,0.16) 0%, rgba(61,219,130,0.08) 100%)',
            border: '1px solid rgba(61,219,130,0.30)',
            color: '#3DDB82', fontSize: '11px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(61,219,130,0.12), 0 0 24px rgba(61,219,130,0.10)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          Continuar
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── STEP 1: Bienvenida ─────────────────── */
function StepBienvenida({ onNext }: { onNext: () => void }) {
  return (
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 28px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: '-160px', left: '50%',
        transform: 'translateX(-50%)', width: '480px', height: '360px',
        background: 'radial-gradient(ellipse, rgba(77,158,255,0.09) 0%, rgba(61,219,130,0.04) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '320px', width: '100%', textAlign: 'center' }}
      >
        {/* Logo mark */}
        <motion.div variants={cardEntrance}>
          <motion.h1
            initial={{ filter: 'blur(10px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(52px,14vw,72px)', fontWeight: 800,
              letterSpacing: '-4px', color: '#EFEFF4', lineHeight: 1,
            }}
          >
            ECA
          </motion.h1>
        </motion.div>

        <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: '#7A7A8C', fontStyle: 'italic' }}>
          Tu mente. Reclamada.
        </motion.p>

        {/* animated line */}
        <motion.div
          variants={cardEntrance}
          initial={{ width: 0 }}
          animate={{ width: '48px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ height: '1px', background: 'linear-gradient(90deg, #3DDB82, #2AB86A)', borderRadius: 9999 }}
        />

        <motion.p variants={cardEntrance} style={{ fontSize: '13px', color: '#3E3E52', lineHeight: 1.6, maxWidth: '240px' }}>
          Un sistema para los que eligen construirse.
        </motion.p>

        <motion.button
          variants={cardEntrance}
          whileHover={{ scale: 1.02, boxShadow: '0 0 0 1px rgba(61,219,130,0.4), 0 0 28px rgba(61,219,130,0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          style={{
            marginTop: '8px', width: '100%', height: '56px', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(61,219,130,0.14) 0%, rgba(61,219,130,0.07) 100%)',
            border: '1px solid rgba(61,219,130,0.30)',
            color: '#3DDB82', fontSize: '11px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(61,219,130,0.12), 0 0 24px rgba(61,219,130,0.08)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          Empezar
        </motion.button>

        <motion.p variants={cardEntrance} style={{ fontSize: '11px', color: '#262636', letterSpacing: '0.3px' }}>
          Sin cuenta. Sin suscripción. Solo tú.
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ─── STEP 1: Enemigos ───────────────────── */
function StepEnemigos({ onNext }: { onNext: (targets: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  const toggle = (opt: string) => {
    setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]);
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    const targets = selected.map(t => (t === 'Otro' && otherText.trim()) ? otherText.trim() : t);
    onNext(targets);
  };

  return (
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      padding: '60px 20px 0',
    }}>
      <Dots active={0} />

      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1 }}>
        <motion.p variants={cardEntrance} className="text-label" style={{ color: '#7A7A8C', marginBottom: '10px' }}>
          PASO 1 DE 3
        </motion.p>
        <motion.h2 variants={cardEntrance} className="text-title" style={{ color: '#EFEFF4', marginBottom: '6px' }}>
          ¿Qué quieres eliminar?
        </motion.h2>
        <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: '#7A7A8C', marginBottom: '28px' }}>
          Sin juicios. Solo datos.
        </motion.p>

        <motion.div variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {targetOptions.map(opt => {
            const sel = selected.includes(opt);
            return (
              <motion.button
                key={opt}
                variants={cardEntrance}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggle(opt)}
                style={{
                  padding: '13px 14px', borderRadius: '14px',
                  background: sel ? 'rgba(61,219,130,0.09)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${sel ? 'rgba(61,219,130,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  color: sel ? '#EFEFF4' : '#7A7A8C',
                  fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  textAlign: 'left', transition: 'all 0.18s ease',
                  boxShadow: sel ? '0 0 16px rgba(61,219,130,0.08)' : 'none',
                }}
              >
                <AnimatePresence>
                  {sel && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    >
                      <Check size={13} color="#3DDB82" strokeWidth={2.5} />
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
              animate={{ opacity: 1, height: 48, marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              placeholder="¿Cuál es tu enemigo?"
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              style={{
                display: 'block', width: '100%', height: '48px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.10)', borderRadius: '14px',
                padding: '0 16px', color: '#EFEFF4', fontSize: '15px', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: '14px', fontSize: '13px', color: '#3DDB82' }}
            >
              {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── sticky CTA — sits flush, above safe-area ── */}
      <div style={{
        position: 'sticky', bottom: 0,
        padding: '16px 0 calc(16px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, #07070A 65%, transparent)',
      }}>
        <motion.button
          animate={{ opacity: selected.length > 0 ? 1 : 0.35, scale: selected.length > 0 ? 1 : 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          whileTap={selected.length > 0 ? { scale: 0.97 } : {}}
          onClick={handleContinue}
          disabled={selected.length === 0}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #2AB86A 0%, #3DDB82 100%)',
            border: 'none', color: '#07070A',
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selected.length > 0 ? '0 4px 20px rgba(61,219,130,0.25)' : 'none',
          }}
        >
          Continuar
        </motion.button>
      </div>
    </div>
  );
}

/* ─── STEP 2: Reglas ─────────────────────── */
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
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      padding: '60px 20px 0',
    }}>
      <Dots active={1} />

      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <motion.h2 variants={cardEntrance} className="text-title" style={{ color: '#EFEFF4', marginBottom: '4px' }}>
          Define tu código.
        </motion.h2>
        <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: '#7A7A8C', marginBottom: '12px' }}>
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
                padding: '16px 20px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${rule.enabled ? 'rgba(61,219,130,0.14)' : 'rgba(255,255,255,0.07)'}`,
                transition: 'border 0.2s ease',
              }}
            >
              <ToggleSwitch
                checked={rule.enabled}
                onChange={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                label={rule.text}
              />
              <span style={{ flex: 1, fontSize: '15px', color: rule.enabled ? '#EFEFF4' : '#7A7A8C', lineHeight: 1.4 }}>
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
                  padding: '16px 20px', borderRadius: '18px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <input
                  autoFocus
                  placeholder="Tu propia regla..."
                  value={newRuleText}
                  onChange={e => setNewRuleText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') setAddingRule(false); }}
                  onBlur={addRule}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#EFEFF4', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setAddingRule(true)}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '18px',
                  background: 'transparent', border: '1px dashed rgba(255,255,255,0.10)',
                  color: '#7A7A8C', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Plus size={15} /> Añadir mi regla
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <div style={{
        position: 'sticky', bottom: 0,
        padding: '16px 0 calc(16px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, #07070A 65%, transparent)',
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext(rules)}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #2AB86A 0%, #3DDB82 100%)',
            border: 'none', color: '#07070A',
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(61,219,130,0.25)',
          }}
        >
          Continuar
        </motion.button>
      </div>
    </div>
  );
}

/* ─── STEP 3: Compromiso ─────────────────── */
function StepCompromiso({ onFinish }: { onFinish: () => void }) {
  const [show01, setShow01] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow01(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ambient */}
      <div style={{
        position: 'absolute', top: '-180px', left: '50%',
        transform: 'translateX(-50%)', width: '560px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(61,219,130,0.12) 0%, rgba(61,219,130,0.04) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Dots active={2} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={easeCustom}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', width: '100%' }}
      >
        {/* Big number */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {!show01 ? (
              <motion.div key="00" exit={{ rotateX: 90, opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                style={{
                  fontSize: 'clamp(80px,22vw,130px)', fontWeight: 800,
                  letterSpacing: '-6px', lineHeight: 0.9, color: '#3E3E52',
                }}
              >
                00
              </motion.div>
            ) : (
              <motion.div
                key="01"
                initial={{ rotateX: -90, opacity: 0, y: 20 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  fontSize: 'clamp(80px,22vw,130px)', fontWeight: 800,
                  letterSpacing: '-6px', lineHeight: 0.9,
                  background: 'linear-gradient(155deg, #EFEFF4 0%, #EFEFF4 30%, #3DDB82 58%, #2AB86A 80%, #1D9958 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 40px rgba(61,219,130,0.25))',
                }}
              >
                01
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p style={{ fontSize: '15px', color: '#7A7A8C', fontWeight: 500 }}>
          Tu primer día empieza ahora.
        </p>
        <p style={{ fontSize: '14px', color: '#3E3E52', maxWidth: '260px', lineHeight: 1.7, fontStyle: 'italic' }}>
          No hay app que cambie nada.<br />
          Solo las decisiones que tomas cada día.
        </p>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 0 1px rgba(61,219,130,0.4), 0 8px 32px rgba(61,219,130,0.30)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onFinish}
          style={{
            marginTop: '8px', width: '100%', height: '58px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #2AB86A 0%, #3DDB82 50%, #4DE89A 100%)',
            border: 'none', color: '#07070A',
            fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(61,219,130,0.3), 0 4px 24px rgba(61,219,130,0.25)',
          }}
        >
          Comenzar mi sistema
        </motion.button>
      </motion.div>
    </div>
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
    <div style={{ position: 'fixed', inset: 0, background: '#07070A', zIndex: 200, overflowY: 'auto', overflowX: 'hidden' }}>
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
