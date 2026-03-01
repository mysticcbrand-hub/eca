'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { Rule } from '@/lib/storage';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { staggerContainer, cardEntrance, easeCustom } from '@/lib/animations';
import { Plus, Check } from 'lucide-react';

const defaultRules: Rule[] = [
  { id: '1', text: 'Sin dopamina barata antes del mediodía', enabled: true, custom: false },
  { id: '2', text: 'Ante el impulso: esperar 10 minutos', enabled: true, custom: false },
  { id: '3', text: 'Cada día, algo difícil', enabled: true, custom: false },
];

const targetOptions = [
  'Pornografía',
  'Redes sociales',
  'YouTube infinito',
  'Videojuegos compulsivos',
  'Series / Netflix',
  'Otro',
];

function StepBienvenida({ onNext }: { onNext: () => void }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#07070A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%',
        transform: 'translateX(-50%)', width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(77,158,255,0.08) 0%, rgba(77,158,255,0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '320px', width: '100%' }}
      >
        <motion.h1
          variants={cardEntrance}
          style={{
            fontSize: 'clamp(36px,9vw,56px)', fontWeight: 700,
            letterSpacing: '-2.5px', color: '#EFEFF4',
            filter: 'blur(0px)', margin: 0,
          }}
        >
          ECA
        </motion.h1>
        <motion.p
          variants={cardEntrance}
          style={{ fontSize: '15px', color: '#7A7A8C', fontStyle: 'italic', textAlign: 'center', margin: 0 }}
        >
          Your mind. Reclaimed.
        </motion.p>
        <motion.div
          variants={cardEntrance}
          initial={{ width: 0 }}
          animate={{ width: '40px' }}
          style={{
            height: '1px',
            background: '#3DDB82',
            borderRadius: '9999px',
          }}
        />
        <motion.p
          variants={cardEntrance}
          style={{ fontSize: '13px', color: '#3E3E52', textAlign: 'center', margin: 0 }}
        >
          Un sistema para los que eligen construirse.
        </motion.p>
        <motion.button
          variants={cardEntrance}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          style={{
            marginTop: '12px',
            width: '100%',
            height: '54px',
            borderRadius: '9999px',
            background: 'rgba(61,219,130,0.10)',
            border: '1px solid rgba(61,219,130,0.35)',
            color: '#3DDB82',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(61,219,130,0.15), 0 0 20px rgba(61,219,130,0.08)',
          }}
        >
          Empezar
        </motion.button>
      </motion.div>
    </div>
  );
}

function StepEnemigos({ onNext }: { onNext: (targets: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState('');

  const toggle = (opt: string) => {
    if (opt === 'Otro') {
      setShowOther(s => !s);
      setSelected(s => s.includes('Otro') ? s.filter(x => x !== 'Otro') : [...s, 'Otro']);
      return;
    }
    setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]);
  };

  const handleContinue = () => {
    const targets = selected.map(t => t === 'Otro' && otherText ? otherText : t).filter(Boolean);
    onNext(targets.length ? targets : selected);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#07070A', display: 'flex', flexDirection: 'column', padding: '60px 20px 100px' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: i===0?20:6, height: 6, borderRadius: 9999, background: i===0?'#3DDB82':'rgba(255,255,255,0.10)', transition: 'width 0.3s' }} />
        ))}
      </div>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1 }}>
        <motion.p variants={cardEntrance} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#7A7A8C', marginBottom: '12px' }}>
          PASO 1 DE 3
        </motion.p>
        <motion.h2 variants={cardEntrance} style={{ fontSize: 'clamp(22px,5.5vw,30px)', fontWeight: 600, letterSpacing: '-1px', color: '#EFEFF4', marginBottom: '8px' }}>
          ¿Qué quieres eliminar?
        </motion.h2>
        <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: '#7A7A8C', marginBottom: '28px' }}>
          Sin juicios. Solo datos.
        </motion.p>
        <motion.div variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {targetOptions.map(opt => {
            const isSelected = selected.includes(opt);
            return (
              <motion.button
                key={opt}
                variants={cardEntrance}
                onClick={() => toggle(opt)}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '9999px',
                  background: isSelected ? 'rgba(61,219,130,0.10)' : '#1C1C26',
                  border: `1px solid ${isSelected ? '#3DDB82' : 'rgba(255,255,255,0.06)'}`,
                  color: isSelected ? '#EFEFF4' : '#7A7A8C',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                      <Check size={14} color="#3DDB82" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {opt}
              </motion.button>
            );
          })}
        </motion.div>
        {showOther && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 48 }}
            placeholder="Escribe tu enemigo..."
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
            style={{
              marginTop: '12px', width: '100%', height: '48px',
              background: '#1C1C26', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '12px', padding: '0 16px',
              color: '#EFEFF4', fontSize: '15px',
              outline: 'none',
            }}
          />
        )}
        {selected.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', fontSize: '13px', color: '#7A7A8C' }}>
            {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
          </motion.p>
        )}
      </motion.div>
      {/* Sticky bottom button */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        padding: '20px 20px calc(20px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, #07070A 70%, transparent)',
      }}>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          style={{
            width: '100%', height: '54px', borderRadius: '16px',
            background: selected.length > 0 ? 'linear-gradient(135deg, #2AB86A, #3DDB82)' : '#1C1C26',
            border: 'none', color: '#EFEFF4',
            fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase',
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            opacity: selected.length > 0 ? 1 : 0.4,
            transition: 'all 0.3s ease',
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

function StepReglas({ onNext }: { onNext: (rules: Rule[]) => void }) {
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [newRuleText, setNewRuleText] = useState('');
  const [addingRule, setAddingRule] = useState(false);

  const toggleRule = (id: string) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
  };

  const addRule = () => {
    if (!newRuleText.trim() || rules.length >= 8) return;
    const newRule: Rule = { id: Date.now().toString(), text: newRuleText.trim(), enabled: true, custom: true };
    setRules(r => [...r, newRule]);
    setNewRuleText('');
    setAddingRule(false);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#07070A', display: 'flex', flexDirection: 'column', padding: '60px 20px 120px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: i===1?20:6, height: 6, borderRadius: 9999, background: i===1?'#3DDB82':'rgba(255,255,255,0.10)', transition: 'width 0.3s' }} />
        ))}
      </div>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <motion.h2 variants={cardEntrance} style={{ fontSize: 'clamp(22px,5.5vw,30px)', fontWeight: 600, letterSpacing: '-1px', color: '#EFEFF4', marginBottom: '4px' }}>
          Define tu código.
        </motion.h2>
        <motion.p variants={cardEntrance} style={{ fontSize: '15px', color: '#7A7A8C', marginBottom: '8px' }}>
          Solo tú lo verás. Solo tú lo cumplirás.
        </motion.p>
        {rules.map(rule => (
          <motion.div
            key={rule.id}
            variants={cardEntrance}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${rule.enabled ? 'rgba(61,219,130,0.15)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'border 0.2s ease',
            }}
          >
            <ToggleSwitch checked={rule.enabled} onChange={() => toggleRule(rule.id)} label={rule.text} />
            <span style={{ fontSize: '15px', color: '#EFEFF4', flex: 1 }}>{rule.text}</span>
          </motion.div>
        ))}
        {rules.length < 8 && (
          <motion.div variants={cardEntrance}>
            {addingRule ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '16px 20px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <input
                  autoFocus
                  placeholder="Escribe tu propia regla..."
                  value={newRuleText}
                  onChange={e => setNewRuleText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRule()}
                  onBlur={addRule}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: '#EFEFF4', fontSize: '15px', outline: 'none',
                  }}
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setAddingRule(true)}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '20px',
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.10)',
                  color: '#7A7A8C', fontSize: '15px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                }}
              >
                <Plus size={16} /> Agregar mi regla
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        padding: '20px 20px calc(20px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, #07070A 70%, transparent)',
      }}>
        <button
          onClick={() => onNext(rules)}
          style={{
            width: '100%', height: '54px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #2AB86A, #3DDB82)',
            border: 'none', color: '#EFEFF4',
            fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

function StepCompromiso({ onFinish }: { onFinish: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c >= 1) { clearInterval(interval); return 1; }
        return c + 0.05;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100dvh', background: '#07070A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-200px', left: '50%',
        transform: 'translateX(-50%)', width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(61,219,130,0.12) 0%, rgba(61,219,130,0.04) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: i===2?20:6, height: 6, borderRadius: 9999, background: i===2?'#3DDB82':'rgba(255,255,255,0.10)' }} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeCustom}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}
      >
        <div
          style={{
            fontSize: 'clamp(80px,22vw,140px)', fontWeight: 700,
            letterSpacing: '-6px', lineHeight: 0.9,
            background: 'linear-gradient(160deg, #EFEFF4 0%, #EFEFF4 35%, #3DDB82 60%, #2AB86A 80%, #1D9958 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          {count < 1 ? '00' : '01'}
        </div>
        <p style={{ fontSize: '15px', color: '#7A7A8C', margin: 0 }}>
          Tu primer día empieza ahora.
        </p>
        <p style={{ fontSize: '15px', color: '#7A7A8C', maxWidth: '280px', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          No hay app que cambie nada.<br />
          Solo las decisiones que tomas cada día.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onFinish}
          style={{
            marginTop: '8px',
            width: '100%', height: '58px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #2AB86A 0%, #3DDB82 50%, #2AB86A 100%)',
            border: 'none', color: '#EFEFF4',
            fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(61,219,130,0.3), 0 0 20px rgba(61,219,130,0.15), 0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          Comenzar mi sistema
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleFinish = (rules: Rule[]) => {
    storage.setOnboarded();
    storage.setStartDate(new Date().toISOString());
    storage.setStreak(0);
    storage.setBestStreak(0);
    storage.setTotalDays(0);
    storage.setRules(rules);
    router.replace('/');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div key="step0" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={easeCustom}>
          <StepBienvenida onNext={() => setStep(1)} />
        </motion.div>
      )}
      {step === 1 && (
        <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={easeCustom}>
          <StepEnemigos onNext={(targets) => { storage.setTargets(targets); setStep(2); }} />
        </motion.div>
      )}
      {step === 2 && (
        <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={easeCustom}>
          <StepReglas onNext={(rules) => { storage.setRules(rules); setStep(3); }} />
        </motion.div>
      )}
      {step === 3 && (
        <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={easeCustom}>
          <StepCompromiso onFinish={() => handleFinish(storage.getRules())} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
