'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Check } from 'lucide-react';
import { useECA } from '@/hooks/useECA';
import { useAmbientGlow } from '@/hooks/useAmbientGlow';
import { useDailyQuote } from '@/hooks/useDailyQuote';
import { storage } from '@/lib/storage';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { GradientText } from '@/components/ui/GradientText';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Toast } from '@/components/ui/Toast';
import { staggerContainer, cardEntrance, spring } from '@/lib/animations';
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

export default function TodayPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showCumplido, setShowCumplido] = useState(false);
  const [showRecaida, setShowRecaida]   = useState(false);
  const [trigger, setTrigger]           = useState('');
  const [toastMsg, setToastMsg]         = useState('');
  const [toastOn, setToastOn]           = useState(false);

  const { streak, bestStreak, totalDays, checkedIn, relapses, checkin, registerRelapse } = useECA();
  const { glowStyle, triggerSuccess, triggerRelapse } = useAmbientGlow();
  const quote = useDailyQuote();

  useEffect(() => {
    setMounted(true);
    if (!storage.isOnboarded()) router.replace('/onboarding');
  }, [router]);

  if (!mounted) return null;

  const ringValue  = Math.min(100, (streak / 7) * 100);
  const isRecord   = streak > 0 && streak >= bestStreak && streak > 1;

  const handleCheckin = () => {
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

  return (
    <PageWrapper glowStyle={glowStyle}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 8px',
      }}>
        <span className="text-label" style={{ color: '#3DDB82', letterSpacing: '3px' }}>ECA</span>
        <span className="text-label" style={{ color: '#3E3E52' }}>{formatDate()}</span>
      </div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {/* ── Hero Card ── */}
        <motion.div
          variants={cardEntrance}
          style={{
            padding: '32px 28px 28px',
            borderRadius: '28px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.11)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.09) inset, 0 -1px 0 rgba(0,0,0,0.28) inset, 0 16px 56px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* inner top glow */}
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '280px', height: '200px',
            background: streak > 0
              ? 'radial-gradient(ellipse, rgba(61,219,130,0.10) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(77,158,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'background 1.5s ease',
          }} />

          <p className="text-label" style={{ color: streak > 0 ? '#3DDB82' : '#3E3E52', marginBottom: '16px', letterSpacing: '2px' }}>
            {streak > 0 ? 'RACHA ACTIVA' : 'SIN RACHA'}
          </p>

          {/* Ring + number */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
            <ProgressRing value={ringValue} size={164} strokeWidth={3} />
            <div style={{ position: 'absolute' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={streak}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={spring}
                  style={{ textAlign: 'center' }}
                >
                  {streak > 7 ? (
                    <span
                      className="text-gradient-green"
                      style={{
                        fontSize: 'clamp(56px,15vw,90px)', fontWeight: 800,
                        letterSpacing: '-4px', lineHeight: 1, display: 'block',
                        filter: 'drop-shadow(0 0 30px rgba(61,219,130,0.35))',
                      }}
                    >
                      {streak}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 'clamp(56px,15vw,90px)', fontWeight: 800,
                      letterSpacing: '-4px', lineHeight: 1, display: 'block',
                      color: streak === 0 ? '#3E3E52' : '#EFEFF4',
                    }}>
                      {streak}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#7A7A8C', marginBottom: '20px' }}>
            {streak === 0 ? 'días' : streak === 1 ? 'día' : 'días consecutivos'}
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#7A7A8C', fontStyle: 'italic', maxWidth: '220px', margin: '0 auto', lineHeight: 1.65 }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'MEJOR RACHA', value: bestStreak, color: isRecord && bestStreak > 0 ? '#E2B96A' : '#EFEFF4' },
            { label: 'TOTAL DÍAS',  value: totalDays,  color: '#EFEFF4' },
            { label: 'RECAÍDAS',    value: relapses.length, color: relapses.length > 0 ? '#FF4D4D' : '#3E3E52', display: relapses.length > 0 ? String(relapses.length) : '—' },
          ].map(s => (
            <motion.div
              key={s.label}
              variants={cardEntrance}
              style={{
                flex: 1, padding: '16px 10px', borderRadius: '18px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset',
              }}
            >
              <div style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 700, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                {s.display ?? s.value}
              </div>
              <div className="text-label" style={{ color: '#3E3E52', marginTop: '6px', fontSize: '9.5px', letterSpacing: '1px' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div variants={cardEntrance} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Cumplido */}
          <motion.button
            whileHover={!checkedIn ? { scale: 1.01, boxShadow: '0 0 0 1px rgba(61,219,130,0.45), 0 0 32px rgba(61,219,130,0.20), 0 6px 20px rgba(0,0,0,0.4)' } : {}}
            whileTap={!checkedIn ? { scale: 0.97 } : {}}
            onClick={!checkedIn ? handleCheckin : undefined}
            disabled={checkedIn}
            style={{
              width: '100%', height: '58px', borderRadius: '18px',
              background: checkedIn
                ? 'rgba(61,219,130,0.04)'
                : 'linear-gradient(135deg, rgba(61,219,130,0.16) 0%, rgba(61,219,130,0.09) 50%, rgba(42,184,106,0.13) 100%)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${checkedIn ? 'rgba(61,219,130,0.09)' : 'rgba(61,219,130,0.32)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: checkedIn ? 'not-allowed' : 'pointer',
              opacity: checkedIn ? 0.45 : 1,
              boxShadow: checkedIn ? 'none' : '0 0 0 1px rgba(61,219,130,0.18), 0 0 24px rgba(61,219,130,0.12), 0 4px 16px rgba(0,0,0,0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            {checkedIn
              ? <Clock size={18} color="#3DDB82" strokeWidth={1.5} />
              : <CheckCircle size={18} color="#3DDB82" strokeWidth={1.5} />}
            <span className="text-label" style={{ color: '#EFEFF4', letterSpacing: '1.5px' }}>
              {checkedIn ? 'MARCADO · VUELVE MAÑANA' : 'HE CUMPLIDO HOY'}
            </span>
          </motion.button>

          {/* Recaída */}
          <motion.button
            whileTap={{ x: [0, -5, 5, -3, 3, 0] as unknown as number, transition: { duration: 0.35 } }}
            onClick={() => setShowRecaida(true)}
            style={{
              width: '100%', height: '48px', borderRadius: '18px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer', transition: 'border 0.15s ease',
            }}
          >
            <AlertTriangle size={15} color="#3E3E52" strokeWidth={1.5} />
            <span style={{ fontSize: '13px', color: '#7A7A8C', fontWeight: 400 }}>registrar recaída</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Modal Cumplido ── */}
      <BottomSheet open={showCumplido} onClose={() => setShowCumplido(false)}>
        <div style={{ padding: '36px 24px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.08 }}
            style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2AB86A, #3DDB82, #4DE89A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 8px rgba(61,219,130,0.10), 0 0 40px rgba(61,219,130,0.25)',
            }}
          >
            <Check size={34} color="#07070A" strokeWidth={2.8} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <GradientText style={{ fontSize: 'clamp(28px,8vw,44px)', fontWeight: 800, letterSpacing: '-2px', display: 'block' }}>
              DÍA {streak}
            </GradientText>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#7A7A8C', letterSpacing: '-0.3px', marginTop: '4px' }}>
              Completado.
            </p>
          </motion.div>

          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            style={{ fontSize: '14px', color: '#7A7A8C', fontStyle: 'italic', maxWidth: '260px', lineHeight: 1.7 }}>
            &ldquo;{getRandomMessage(cumplimientoMessages)}&rdquo;
          </motion.p>

          <AnimatePresence>
            {isRecord && (
              <motion.div
                initial={{ scale: 0, y: 10 }} animate={{ scale: [0, 1.06, 1], y: 0 }}
                transition={{ delay: 0.38, duration: 0.5, type: 'spring' }}
                style={{
                  padding: '8px 20px', borderRadius: '9999px',
                  background: 'rgba(226,185,106,0.10)', border: '1px solid rgba(226,185,106,0.28)',
                  color: '#E2B96A', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                }}
              >
                ⬆ NUEVA MEJOR RACHA
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setShowCumplido(false)}
            style={{ background: 'none', border: 'none', color: '#3E3E52', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
            Cerrar
          </button>
        </div>
      </BottomSheet>

      {/* ── Modal Recaída ── */}
      <BottomSheet open={showRecaida} onClose={() => { setShowRecaida(false); setTrigger(''); }}>
        <div style={{ padding: '32px 20px 40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 className="text-title" style={{ color: '#EFEFF4', marginBottom: '6px' }}>Registrar recaída</h3>
            <p style={{ fontSize: '15px', color: '#7A7A8C' }}>¿Qué lo desencadenó?</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TRIGGERS.map(opt => (
              <button
                key={opt}
                onClick={() => setTrigger(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', borderRadius: '16px',
                  background: trigger === opt ? 'rgba(255,77,77,0.07)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${trigger === opt ? 'rgba(255,77,77,0.28)' : 'rgba(255,255,255,0.07)'}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${trigger === opt ? '#FF4D4D' : 'rgba(255,255,255,0.18)'}`,
                  background: trigger === opt ? '#FF4D4D' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                }}>
                  {trigger === opt && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <span style={{ fontSize: '14px', color: '#EFEFF4', fontWeight: trigger === opt ? 500 : 400 }}>{opt}</span>
              </button>
            ))}
          </div>
          <motion.button
            whileTap={trigger ? { scale: 0.98 } : {}}
            onClick={handleRelapse}
            disabled={!trigger}
            style={{
              width: '100%', height: '52px', borderRadius: '16px',
              background: trigger ? 'rgba(255,77,77,0.10)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${trigger ? 'rgba(255,77,77,0.35)' : 'rgba(255,255,255,0.07)'}`,
              color: trigger ? '#FF4D4D' : '#3E3E52',
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase',
              cursor: trigger ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            Confirmar y reiniciar
          </motion.button>
          <button onClick={() => { setShowRecaida(false); setTrigger(''); }}
            style={{ background: 'none', border: 'none', color: '#3E3E52', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <Toast message={toastMsg} visible={toastOn} onHide={() => setToastOn(false)} />
    </PageWrapper>
  );
}
