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
import { GlassCard } from '@/components/ui/GlassCard';
import { Toast } from '@/components/ui/Toast';
import { staggerContainer, cardEntrance, easeCustom, spring } from '@/lib/animations';
import { cumplimientoMessages, recaidaMessages, getRandomMessage } from '@/lib/quotes';

const TRIGGER_OPTIONS = [
  'Estrés acumulado',
  'Aburrimiento',
  'Soledad',
  'Cansancio / baja energía',
  'Estaba en modo automático',
  'Prefiero no registrar',
];

function formatDate() {
  const d = new Date();
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return `${days[d.getDay()]} · ${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

export default function TodayPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showCumplido, setShowCumplido] = useState(false);
  const [showRecaida, setShowRecaida] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [, setPrevStreak] = useState(0);

  const { streak, bestStreak, totalDays, checkedIn, relapses, checkin, registerRelapse } = useECA();
  const { glowStyle, triggerSuccess, triggerRelapse } = useAmbientGlow();
  const quote = useDailyQuote();

  useEffect(() => {
    setMounted(true);
    if (!storage.isOnboarded()) {
      router.replace('/onboarding');
    }
  }, [router]);

  if (!mounted) return null;

  const ringValue = Math.min(100, (streak / 7) * 100);
  const isRecord = streak > 0 && streak >= bestStreak && streak > 1;

  const handleCheckin = () => {
    setPrevStreak(streak);
    checkin();
    triggerSuccess();
    setShowCumplido(true);
  };

  const handleRelapse = () => {
    if (!selectedTrigger) return;
    registerRelapse(selectedTrigger);
    triggerRelapse();
    setShowRecaida(false);
    setSelectedTrigger('');
    const msg = getRandomMessage(recaidaMessages);
    setToastMsg(msg);
    setToastVisible(true);
  };

  return (
    <PageWrapper glowStyle={glowStyle}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', height: '52px',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#7A7A8C' }}>ECA</span>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#3E3E52' }}>{formatDate()}</span>
      </div>

      {/* Hero Card */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <GlassCard level={2} animate style={{ padding: '28px', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: streak > 0 ? '#3DDB82' : '#3E3E52', marginBottom: '8px' }}>
            {streak > 0 ? 'RACHA ACTIVA' : 'SIN RACHA'}
          </p>

          {/* Number + Ring */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
            <ProgressRing value={ringValue} size={160} strokeWidth={3} />
            <div style={{ position: 'absolute' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={streak}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={spring}
                >
                  {streak > 7 ? (
                    <GradientText style={{ fontSize: 'clamp(60px,16vw,100px)', fontWeight: 700, letterSpacing: '-4px', lineHeight: 1, display: 'block', textShadow: '0 0 80px rgba(61,219,130,0.3)' }}>
                      {streak}
                    </GradientText>
                  ) : (
                    <span style={{
                      fontSize: 'clamp(60px,16vw,100px)', fontWeight: 700, letterSpacing: '-4px', lineHeight: 1, display: 'block',
                      color: streak === 0 ? '#3E3E52' : '#EFEFF4',
                      textShadow: streak > 0 ? '0 0 60px rgba(61,219,130,0.2)' : 'none',
                    }}>
                      {streak}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p style={{ fontSize: '15px', color: '#7A7A8C', marginBottom: '20px' }}>
            {streak === 1 ? 'día' : streak === 0 ? 'días' : 'días consecutivos'}
          </p>

          {/* Daily quote */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#7A7A8C', fontStyle: 'italic', maxWidth: '240px', margin: '0 auto', lineHeight: 1.6 }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </GlassCard>

        {/* Quick Stats Row */}
        <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'MEJOR RACHA', value: bestStreak, color: isRecord && bestStreak > 0 ? '#E2B96A' : '#EFEFF4' },
            { label: 'TOTAL DÍAS', value: totalDays, color: '#EFEFF4' },
            { label: 'RECAÍDAS', value: relapses.length, color: relapses.length > 0 ? '#FF4D4D' : '#3E3E52', display: relapses.length > 0 ? String(relapses.length) : '—' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              variants={cardEntrance}
              style={{
                flex: 1, padding: '16px 12px', borderRadius: '20px', textAlign: 'center',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: stat.color, letterSpacing: '-0.5px' }}>
                {stat.display ?? stat.value}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#3E3E52', marginTop: '4px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={cardEntrance} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Cumplido button */}
          <motion.button
            whileHover={!checkedIn ? { scale: 1.01 } : {}}
            whileTap={!checkedIn ? { scale: 0.97 } : {}}
            onClick={!checkedIn ? handleCheckin : undefined}
            disabled={checkedIn}
            style={{
              width: '100%', height: '58px', borderRadius: '16px',
              background: checkedIn
                ? 'rgba(61,219,130,0.04)'
                : 'linear-gradient(135deg, rgba(61,219,130,0.15) 0%, rgba(61,219,130,0.08) 50%, rgba(42,184,106,0.12) 100%)',
              border: `1px solid ${checkedIn ? 'rgba(61,219,130,0.10)' : 'rgba(61,219,130,0.35)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: checkedIn ? 'not-allowed' : 'pointer',
              opacity: checkedIn ? 0.5 : 1,
              boxShadow: checkedIn ? 'none' : '0 0 0 1px rgba(61,219,130,0.3), 0 0 20px rgba(61,219,130,0.15), 0 4px 16px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {checkedIn ? <Clock size={20} color="#3DDB82" /> : <CheckCircle size={20} color="#3DDB82" />}
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#EFEFF4' }}>
              {checkedIn ? 'MARCADO HOY · VUELVE MAÑANA' : 'HE CUMPLIDO HOY'}
            </span>
          </motion.button>

          {/* Recaida button */}
          <motion.button
            whileTap={{ x: [0, -5, 5, -4, 4, -2, 2, 0] as number[], transition: { duration: 0.4 } }}
            onClick={() => setShowRecaida(true)}
            style={{
              width: '100%', height: '48px', borderRadius: '16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer',
            }}
          >
            <AlertTriangle size={16} color="#3E3E52" />
            <span style={{ fontSize: '13px', color: '#7A7A8C' }}>registrar recaída</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal Cumplido */}
      <BottomSheet open={showCumplido} onClose={() => setShowCumplido(false)}>
        <div style={{ padding: '32px 24px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2AB86A, #3DDB82)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 32px rgba(61,219,130,0.3)',
            }}
          >
            <Check size={32} color="white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...easeCustom }}
              style={{ fontSize: 'clamp(28px,7vw,40px)', fontWeight: 700, letterSpacing: '-2px' }}
            >
              <GradientText>DÍA {streak}</GradientText>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 600, color: '#7A7A8C', letterSpacing: '-0.5px', margin: '4px 0 0' }}>
              Completado.
            </motion.p>
          </div>
          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ fontSize: '14px', color: '#7A7A8C', fontStyle: 'italic', maxWidth: '260px', lineHeight: 1.6 }}>
            &ldquo;{getRandomMessage(cumplimientoMessages)}&rdquo;
          </motion.p>
          {isRecord && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.05, 1] }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
              style={{
                padding: '8px 20px', borderRadius: '9999px',
                background: 'rgba(226,185,106,0.10)',
                border: '1px solid #E2B96A',
                color: '#E2B96A', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px',
              }}
            >
              ⬆ NUEVA MEJOR RACHA
            </motion.div>
          )}
          <button
            onClick={() => setShowCumplido(false)}
            style={{ background: 'none', border: 'none', color: '#7A7A8C', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}
          >
            Cerrar
          </button>
        </div>
      </BottomSheet>

      {/* Modal Recaída */}
      <BottomSheet open={showRecaida} onClose={() => { setShowRecaida(false); setSelectedTrigger(''); }}>
        <div style={{ padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 600, color: '#EFEFF4', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
              Registrar recaída
            </h3>
            <p style={{ fontSize: '15px', color: '#7A7A8C', margin: 0 }}>¿Qué lo desencadenó?</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TRIGGER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setSelectedTrigger(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', borderRadius: '16px',
                  background: selectedTrigger === opt ? 'rgba(255,77,77,0.06)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedTrigger === opt ? 'rgba(255,77,77,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${selectedTrigger === opt ? '#FF4D4D' : 'rgba(255,255,255,0.20)'}`,
                  background: selectedTrigger === opt ? '#FF4D4D' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedTrigger === opt && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <span style={{ fontSize: '15px', color: '#EFEFF4' }}>{opt}</span>
              </button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleRelapse}
            disabled={!selectedTrigger}
            style={{
              width: '100%', height: '52px', borderRadius: '16px',
              background: selectedTrigger ? 'rgba(255,77,77,0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedTrigger ? '#FF4D4D' : 'rgba(255,255,255,0.08)'}`,
              color: selectedTrigger ? '#FF4D4D' : '#3E3E52',
              fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
              cursor: selectedTrigger ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            Confirmar y reiniciar
          </motion.button>
          <button
            onClick={() => { setShowRecaida(false); setSelectedTrigger(''); }}
            style={{ background: 'none', border: 'none', color: '#7A7A8C', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </PageWrapper>
  );
}
