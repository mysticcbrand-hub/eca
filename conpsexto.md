┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           Contexto final — Proyecto ECA (Mental Reclaim System)            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


                                  Qué es ECA

ECA es una PWA minimalista de reconstrucción mental para jóvenes
autoexigentes. Es un sistema frío y preciso: seguimiento de rachas, reglas
diarias, objetivos, recaídas, y gamificación avanzada con badges. Diseñado con
una estética Apple-style: glassmorphism real, gradientes suaves y animaciones
sutiles. Todo funciona offline con localStorage y está listo para instalarse
como app.

Tagline: “Tu mente. Reclamada.”

──────────────────────────────────────────────────────────────────────────────

                                Stack técnico

 • Next.js 14 (App Router) + TypeScript
 • Tailwind CSS
 • Framer Motion (animaciones)
 • Recharts (gráficas)
 • next-pwa (PWA + cache offline)
 • Lucide React (iconos)

──────────────────────────────────────────────────────────────────────────────

                              Links importantes

 • Repo GitHub: https://github.com/mysticcbrand-hub/eca
 • Deploy Vercel: https://ecatracker.vercel.app

──────────────────────────────────────────────────────────────────────────────

                      Estructura principal del proyecto

```
/app
  layout.tsx           → shell principal + PWA meta
  page.tsx             → Tab HOY
  /onboarding/page.tsx → flujo inicial de 4 pasos
  /codigo/page.tsx     → Tab REGLAS
  /proyecto/page.tsx   → Tab PROYECTO
  /stats/page.tsx      → Tab STATS

/components
  /layout
    BottomNav.tsx      → navegación inferior glass
    PageWrapper.tsx    → wrapper con ambient glow
  /ui
    GlassCard.tsx      → cards glass
    ProgressBar.tsx
    ProgressRing.tsx
    BottomSheet.tsx
    Toast.tsx
    BadgeToast.tsx     → toast de badge desbloqueada

/hooks
  useECA.ts            → store central basado en localStorage
  useDailyQuote.ts
  useAmbientGlow.ts
  useHaptics.ts

/lib
  storage.ts           → getters/setters tipados localStorage
  quotes.ts            → frases del día + mensajes
  badges.ts            → sistema de badges (rarity + reglas)
  chartData.ts         → transformadores Recharts
  animations.ts        → variantes Framer Motion

/public
  /icons               → icon-192.svg, icon-512.svg + splash
  manifest.json        → manifest PWA
```

──────────────────────────────────────────────────────────────────────────────

                          Cómo funciona internamente

                       LocalStorage (núcleo de estado)

Toda la app persiste datos en localStorage con un esquema claro:

```
eca_onboarded
eca_start_date
eca_streak
eca_best_streak
eca_total_days
eca_last_checkin
eca_relapses
eca_targets
eca_rules
eca_project_main
eca_victories
eca_daily_goal_{date}
eca_checks_{date}
eca_history
eca_badges_unlocked
```

Los getters/setters están en:
/lib/storage.ts

──────────────────────────────────────────────────────────────────────────────
                          Lógica principal (useECA)

Archivo: /hooks/useECA.ts

 • Maneja racha actual, mejor racha, check-ins, recaídas.
 • Controla eca_history para gráficas.
 • Si hay recaída, guarda trigger y reinicia el streak.

──────────────────────────────────────────────────────────────────────────────

                            Secciones clave de UI

                            1. HOY (/app/page.tsx)

 • Hero glass card con racha y ProgressRing.
 • Botones: “He cumplido hoy” y “registrar recaída”.
 • Modales BottomSheet para confirmar.
 • Ambient glow reactivo (verde = éxito, rojo = recaída).

                       2. REGLAS (/app/codigo/page.tsx)

 • Lista editable de reglas (inline edit).
 • Checkboxes diarios, progreso.
 • Sección Badges con grid + raridades.
 • Notificación de badge desbloqueada con BadgeToast.

                     3. PROYECTO (/app/proyecto/page.tsx)

 • Campo editable del proyecto principal.
 • Objetivo diario con botón “Logrado”.
 • Lista de victorias.

                        4. STATS (/app/stats/page.tsx)

 • Cards estadísticas (racha, total, recaídas).
 • Recharts (actividad 30 días + rachas históricas).
 • Heatmap del mes.
 • Badges compactadas.

──────────────────────────────────────────────────────────────────────────────

                       Sistema de Badges (gamificación)

Archivo: /lib/badges.ts

 • Raridades: común, rara, épica, legendaria
 • Desbloqueo automático según rachas, días totales, reglas completas,
   victorias, etc.
 • Legendarias con brillo animado
 • Badges extra incluidas para largo plazo (60, 90, 180 días, etc.)

──────────────────────────────────────────────────────────────────────────────

                                 PWA y diseño

 • manifest.json en español
 • Iconos minimalistas ECA con gradient mesh verde
 • Splash screen con “Tu mente. Reclamada.”
