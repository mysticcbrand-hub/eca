import { storage } from './storage';

export interface ActivityDay {
  date: string;
  label: string;
  value: 1 | -1 | 0;
}

export interface StreakPoint {
  name: string;
  days: number;
}

export function getLast30Days(): ActivityDay[] {
  const history = storage.getHistory();
  const historyMap = new Map(history.map(h => [h.date, h.status]));
  const result: ActivityDay[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const status = historyMap.get(dateStr);
    result.push({
      date: dateStr,
      label,
      value: status === 'done' ? 1 : status === 'relapse' ? -1 : 0,
    });
  }
  return result;
}

export function getStreakHistory(): StreakPoint[] {
  const history = storage.getHistory();
  const points: StreakPoint[] = [];
  let current = 0;
  let streakNum = 0;

  for (const entry of history) {
    if (entry.status === 'done') {
      current++;
    } else if (entry.status === 'relapse') {
      if (current > 0) {
        streakNum++;
        points.push({ name: `Racha ${streakNum}`, days: current });
      }
      current = 0;
    }
  }
  if (current > 0) {
    streakNum++;
    points.push({ name: `Racha ${streakNum}`, days: current });
  }
  return points;
}

export function getCurrentMonthCalendar(): { date: string; status: 'done' | 'relapse' | 'future' | 'today' | 'empty' }[] {
  const history = storage.getHistory();
  const historyMap = new Map(history.map(h => [h.date, h.status]));
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = d.toISOString().slice(0, 10);
    const status = historyMap.get(dateStr);
    let s: 'done' | 'relapse' | 'future' | 'today' | 'empty';
    if (dateStr > todayStr) s = 'future';
    else if (dateStr === todayStr) s = status ? (status as 'done' | 'relapse') : 'today';
    else s = status ? (status as 'done' | 'relapse') : 'empty';
    result.push({ date: dateStr, status: s });
  }
  return result;
}
