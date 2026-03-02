'use client';
import { useState, useCallback, useEffect } from 'react';
import { storage, todayStr, Rule, Relapse, Victory } from '@/lib/storage';

export function useECA() {
  const [streak, setStreakState] = useState(0);
  const [bestStreak, setBestStreakState] = useState(0);
  const [totalDays, setTotalDaysState] = useState(0);
  const [lastCheckin, setLastCheckinState] = useState<string | null>(null);
  const [relapses, setRelapsesState] = useState<Relapse[]>([]);
  const [rules, setRulesState] = useState<Rule[]>([]);
  const [victories, setVictoriesState] = useState<Victory[]>([]);

  useEffect(() => {
    setStreakState(storage.getStreak());
    setBestStreakState(storage.getBestStreak());
    setTotalDaysState(storage.getTotalDays());
    setLastCheckinState(storage.getLastCheckin());
    setRelapsesState(storage.getRelapses());
    setRulesState(storage.getRules());
    setVictoriesState(storage.getVictories());
  }, []);

  const today = todayStr();
  const checkedIn = lastCheckin === today;
  const isNewRecord = streak > 0 && streak >= bestStreak && streak > 1;

  const checkin = useCallback(() => {
    const newStreak = streak + 1;
    const newTotal = totalDays + 1;
    const newBest = Math.max(bestStreak, newStreak);
    storage.setStreak(newStreak);
    storage.setBestStreak(newBest);
    storage.setTotalDays(newTotal);
    storage.setLastCheckin(today);
    storage.addHistory({ date: today, completed: true, streak: newStreak });
    setStreakState(newStreak);
    setBestStreakState(newBest);
    setTotalDaysState(newTotal);
    setLastCheckinState(today);
  }, [streak, totalDays, bestStreak, today]);

  const registerRelapse = useCallback((trigger: string) => {
    const relapse: Relapse = {
      date: today,
      days_reached: streak,
      trigger,
    };
    const newBest = Math.max(bestStreak, streak);
    storage.addRelapse(relapse);
    storage.setBestStreak(newBest);
    storage.setStreak(0);
    storage.setLastCheckin(null);
    storage.addHistory({ date: today, completed: false, streak: 0 });
    setRelapsesState(storage.getRelapses());
    setBestStreakState(newBest);
    setStreakState(0);
    setLastCheckinState(null);
  }, [streak, bestStreak, today]);

  const updateRules = useCallback((newRules: Rule[]) => {
    storage.setRules(newRules);
    setRulesState(newRules);
  }, []);

  const addVictory = useCallback((text: string) => {
    const v: Victory = { date: today, text };
    storage.addVictory(v);
    setVictoriesState(storage.getVictories());
  }, [today]);

  return {
    streak,
    bestStreak,
    totalDays,
    lastCheckin,
    checkedIn,
    relapses,
    rules,
    victories,
    isNewRecord,
    checkin,
    registerRelapse,
    updateRules,
    addVictory,
  };
}
