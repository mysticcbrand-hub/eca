'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Check } from 'lucide-react';
import { useECA } from '@/hooks/useECA';
import { useAmbientGlow } from '@/hooks/useAmbientGlow';
import { useDailyQuote } from '@/hooks/useDailyQuote';
import { storage } from '@/lib/storage';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Toast } from '@/components/ui/Toast';
import { staggerContainer, cardEntrance, springs } from '@/lib/animations';
import { cumplimientoMessages, recaidaMessages, getRandomMessage } from '@/lib/quotes';

const TRIGGERS = [
  'Estrés acumulado',
  'Aburrimiento',
  'Soledad',
  'Cansancio / baja energía',
  'Estaba en modo automático',
  'Prefiero no registrar',
];

function formatDate() {
  const d = new Date();
  const days   = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return `${days[d.getDay()]} · ${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

/* ── Ripple effect ─────────────────────────── */
function useRipple() {
  const ref = useRef<HTMLButtonElement>(null);
  const trigger = (e: React.MouseEvent) => {
    const btn = ref.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(r.width, r.height) * 2;
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - r.left - size / 2}px;
      top:${e.clientY - r.top - size / 2}px;
      background:rgba(48,209,88,0.28);
      transform:scale(0); opacity:0.7;
      animation:ripple-anim 0.55s ease-out forwards;
    `;
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple-anim{to{transform:scale(1);opacity:0;}}';
      document.head.appendChild(s);
    }
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  return { ref, trigger };
}

export default function TodayPage() {
  const router = useRouter();
  const [mounted, setMounted]     = useState(false);
  const [showCumplido, setShowCumplido] = useState(false);
  const [showRecaida, setShowRecaida]   = useState(false);
  const [trigger, setTrigger]           = useState('');
  const [toastMsg, setToastMsg]         = useState('');
  const [toastOn, setToastOn]           = useState(false);

  const { streak, bestStreak, totalDays, checkedIn, relapses, checkin, registerRelapse } = useECA();
  const { glowStyle, triggerSuccess, triggerRelapse } = useAmbientGlow();
  const quote  = useDailyQuote();
  const ripple = useRipple();

  useEffect(() => {
    setMounted(true);
    if (!storage.isOnboarded()) router.replace('/onboarding');
  }, [router]);

  if (!mounted) return null;

  const ringValue = Math.min(100, (streak / 7) * 100);
  const isRecord  = streak > 0 && streak >= bestStreak && streak > 1;
  const isOnFire  = streak >= 14;

  const handleCheckin = (e: React.MouseEvent) => {
    ripple.trigger(e);
    checkin();
    triggerSuccess();
    setShowCumplido(true);
  };

  const handleRelapse = () => {
    if (!trigger) return;
    registerRelapse(trigger);
    triggerRelapse();
    setShowRecaida(false);
    setTrigger('');
    setToastMsg(getRandomMessage(recaidaMessages));
    setToastOn(true);
  };

  const glowState = isOnFire ? 'fire' : 'neutral';

  return (
    <PageWrapper glowStyle={glowStyle} glowState={glowState}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 10px',
      }}>
        <span className="text-label" style={{ color: 'var(--green)', letterSpacing: '3px' }}>ECA</span>
        <span className="text-label" style={{ color: 'var(--t3)' }}>{formatDate()}</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >

        {/* ══════════════════════════════════════
            HERO CARD — glass-2
        ══════════════════════════════════════ */}
        <motion.div
          variants={cardEntrance}
          className="glass-2"
          style={{ padding: '32px 28px 28px', textAlign: 'center' }}
        >
          {/* Interior glow reactivo */}
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '220px',
            background: streak > 0
              ? 'radial-gradient(ellipse, rgba(48,209,88,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(10,132,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'background 1.5s ease',
          }} />

          {/* Fila superior — badge racha */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springs.snappy}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px 5px 8px', borderRadius: 'var(--r-full)',
                  background: 'rgba(48,209,88,0.10)',
                  border: '0.5px solid rgba(48,209,88,0.25)',
                  boxShadow: '0 0 8px rgba(48,209,88,0.15)',
                }}
              >
                {/* Dot pulsante */}
                <div className="pulse-dot" style={{
                  width: 5, height: 5, borderRadius: '50%', background: 'var(--green)',
                }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green-text)' }}>
                  RACHA ACTIVA
                </span>
              </motion.div>
            )}
            {!streak && (
              <span className="text-label" style={{ color: 'var(--t4)' }}>SIN RACHA</span>
            )}
          </div>

          {/* Ring + número MEGA */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', zIndex: 1 }}>
            <ProgressRing value={ringValue} size={180} strokeWidth={4} gold={streak >= 7} />

            {/* Número centrado sobre el ring */}
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={streak}
                  initial={{ scale: 0.85, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ scale: 1,    opacity: 1, filter: 'blur(0px)' }}
                  exit={{   scale: 1.1,   opacity: 0 }}
                  transition={springs.bouncy}
                >
                  {streak > 0 ? (
                    <span
                      className="text-gradient-green"
                      style={{
                        fontSize: 'clamp(56px,15vw,90px)',
                        fontWeight: 800,
                        letterSpacing: '-0.06em',
                        lineHeight: 0.9,
                        display: 'block',
                        filter: 'drop-shadow(0 0 30px rgba(48,209,88,0.30))',
                      }}
                    >
                      {streak}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 'clamp(56px,15vw,90px)',
                      fontWeight: 800,
                      letterSpacing: '-0.06em',
                      lineHeight: 0.9,
                      display: 'block',
                      color: 'var(--t4)',
                    }}>
                      0
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Subtexto días */}
          <p style={{ fontSize: '14px', color: 'var(--t3)', marginBottom: '22px', position: 'relative', zIndex: 1 }}>
            {streak === 1 ? 'día consecutivo' : 'días consecutivos'}
          </p>

          {/* Divider elegante */}
          <div className="divider" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }} />

          {/* Frase del día */}
          <p style={{
            fontSize: '13px', color: 'var(--t3)', fontStyle: 'italic',
            maxWidth: '240px', margin: '0 auto', lineHeight: 1.7,
            position: 'relative', zIndex: 1,
          }}>
            &ldquo;{quote}&rdquo;
          </p>
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'MEJOR',    value: bestStreak,       color: isRecord && bestStreak > 0 ? 'var(--gold-warm)' : 'var(--t1)' },
            { label: 'TOTAL',    value: totalDays,        color: 'var(--t1)' },
            { label: 'RECAÍDAS', value: relapses.length,  color: relapses.length > 0 ? 'var(--red)' : 'var(--t4)', display: relapses.length > 0 ? String(relapses.length) : '—' },
          ].map(s => (
            <motion.div
              key={s.label}
              variants={cardEntrance}
              className="glass-1"
              style={{ flex: 1, padding: '16px 10px', textAlign: 'center' }}
            >
              <div style={{
                fontSize: 'clamp(20px,5vw,28px)', fontWeight: 700,
                color: s.color, letterSpacing: '-0.04em', lineHeight: 1,
              }}>
                {s.display ?? s.value}
              </div>
              <div className="text-label" style={{ color: 'var(--t4)', marginTop: '6px', fontSize: '9.5px' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Botones de acción ── */}
        <motion.div variants={cardEntrance} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* BOTÓN PRIMARIO — HE CUMPLIDO HOY */}
          <motion.button
            ref={ripple.ref}
            whileHover={!checkedIn ? {
              scale: 1.01,
              boxShadow: '0 0 0 1px rgba(48,209,88,0.45), 0 0 32px rgba(48,209,88,0.22), var(--shadow-button)',
            } : {}}
            whileTap={!checkedIn ? { scale: 0.97 } : {}}
            transition={springs.snappy}
            onClick={!checkedIn ? handleCheckin : undefined}
            disabled={checkedIn}
            style={{
              width: '100%', height: '60px', borderRadius: 'var(--r-lg)',
              background: checkedIn
                ? 'rgba(48,209,88,0.04)'
                : 'linear-gradient(135deg, rgba(48,209,88,0.18) 0%, rgba(48,209,88,0.10) 50%, rgba(42,178,70,0.15) 100%)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: `0.5px solid ${checkedIn ? 'rgba(48,209,88,0.09)' : 'rgba(48,209,88,0.35)'}`,
              borderTopColor: checkedIn ? 'rgba(48,209,88,0.09)' : 'rgba(48,209,88,0.50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: checkedIn ? 'default' : 'pointer',
              opacity: checkedIn ? 0.45 : 1,
              boxShadow: checkedIn ? 'none' : '0 0 0 1px rgba(48,209,88,0.18), 0 0 20px rgba(48,209,88,0.10), var(--shadow-button)',
              transition: 'opacity 0.2s ease, background 0.2s ease',
              position: 'relative', overflow: 'hidden',
              pointerEvents: checkedIn ? 'none' : 'auto',
            }}
          >
            {checkedIn
              ? <Clock size={18} color="var(--green-text)" strokeWidth={1.5} />
              : <CheckCircle2 size={18} color="var(--green)" strokeWidth={2} />
            }
            <span className="text-label" style={{ color: checkedIn ? 'var(--t3)' : 'var(--t1)', letterSpacing: '1.5px' }}>
              {checkedIn ? 'MARCADO · VUELVE MAÑANA' : 'HE CUMPLIDO HOY'}
            </span>
          </motion.button>

          {/* BOTÓN SECUNDARIO — registrar recaída */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            onClick={() => setShowRecaida(true)}
            style={{
              width: '100%', height: '50px', borderRadius: 'var(--r-lg)',
              background: 'transparent',
              border: '0.5px solid var(--border-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-dim)')}
          >
            <AlertTriangle size={15} color="var(--t3)" strokeWidth={1.5} />
            <span style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 500 }}>registrar recaída</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════
          MODAL — CUMPLIDO
      ══════════════════════════════════════ */}
      <BottomSheet open={showCumplido} onClose={() => setShowCumplido(false)}>
        <div style={{ padding: '36px 24px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>

          {/* Ícono animado */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.08 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A9E45, #30D158, #4ADE80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 10px rgba(48,209,88,0.10), 0 0 48px rgba(48,209,88,0.28)',
            }}
          >
            <Check size={36} color="#050508" strokeWidth={3} />
          </motion.div>

          {/* Número del día */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <span
              className="text-gradient-green"
              style={{ fontSize: 'clamp(36px,10vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', display: 'block' }}
            >
              DÍA {streak}
            </span>
            <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '-0.02em', marginTop: '4px' }}>
              Completado.
            </p>
          </motion.div>

          <div className="divider" style={{ width: '40px' }} />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            style={{ fontSize: '14px', color: 'var(--t3)', fontStyle: 'italic', maxWidth: '260px', lineHeight: 1.7 }}
          >
            &ldquo;{getRandomMessage(cumplimientoMessages)}&rdquo;
          </motion.p>

          {/* Badge récord */}
          <AnimatePresence>
            {isRecord && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 8 }}
                animate={{ scale: [1.08, 0.97, 1.02, 1], opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: 'var(--r-full)',
                  background: 'linear-gradient(135deg, rgba(232,184,75,0.15) 0%, rgba(255,214,10,0.08) 100%)',
                  border: '0.5px solid rgba(232,184,75,0.35)',
                  boxShadow: '0 0 0 1px rgba(232,184,75,0.10), 0 0 16px rgba(232,184,75,0.20)',
                  color: 'var(--gold-warm)',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                ✦ NUEVA MEJOR RACHA
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowCumplido(false)}
            style={{ background: 'none', border: 'none', color: 'var(--t4)', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}
          >
            Cerrar
          </button>
        </div>
      </BottomSheet>

      {/* ══════════════════════════════════════
          MODAL — RECAÍDA
      ══════════════════════════════════════ */}
      <BottomSheet open={showRecaida} onClose={() => { setShowRecaida(false); setTrigger(''); }}>
        <div style={{ padding: '28px 20px 40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 className="text-title" style={{ color: 'var(--t1)', marginBottom: '6px' }}>Registrar recaída</h3>
            <p style={{ fontSize: '15px', color: 'var(--t3)' }}>¿Qué lo desencadenó?</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {TRIGGERS.map(opt => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.98 }}
                transition={springs.snappy}
                onClick={() => setTrigger(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '13px 16px', borderRadius: 'var(--r-md)',
                  background: trigger === opt ? 'rgba(255,59,48,0.07)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `0.5px solid ${trigger === opt ? 'rgba(255,59,48,0.30)' : 'var(--border-dim)'}`,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${trigger === opt ? 'var(--red)' : 'var(--border-mid)'}`,
                  background: trigger === opt ? 'var(--red)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}>
                  {trigger === opt && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <span style={{ fontSize: '14px', color: trigger === opt ? 'var(--t1)' : 'var(--t2)', fontWeight: trigger === opt ? 500 : 400 }}>
                  {opt}
                </span>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileTap={trigger ? { scale: 0.98 } : {}}
            transition={springs.snappy}
            onClick={handleRelapse}
            disabled={!trigger}
            style={{
              width: '100%', height: '52px', borderRadius: 'var(--r-lg)',
              background: trigger ? 'rgba(255,59,48,0.10)' : 'rgba(255,255,255,0.03)',
              border: `0.5px solid ${trigger ? 'rgba(255,59,48,0.35)' : 'var(--border-dim)'}`,
              color: trigger ? 'var(--red)' : 'var(--t4)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: trigger ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            Confirmar y reiniciar
          </motion.button>

          <button
            onClick={() => { setShowRecaida(false); setTrigger(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--t4)', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <Toast message={toastMsg} visible={toastOn} onHide={() => setToastOn(false)} variant="warning" />
    </PageWrapper>
  );
}
