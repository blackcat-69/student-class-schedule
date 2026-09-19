export interface ParsedTime {
  hours: number;
  minutes: number;
}

export function parseTime(timeStr: string): ParsedTime {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

export function formatTime(time: ParsedTime): string {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`;
}

export function durationMinutes(start: string, end: string): number {
  const s = parseTime(start);
  const e = parseTime(end);
  return (e.hours * 60 + e.minutes) - (s.hours * 60 + s.minutes);
}

export function sortByTime(a: { startTime: string }, b: { startTime: string }): number {
  const aTime = parseTime(a.startTime);
  const bTime = parseTime(b.startTime);
  return (aTime.hours * 60 + aTime.minutes) - (bTime.hours * 60 + bTime.minutes);
}

export function timeToPercent(
  time: string,
  dayStart: string = '08:00',
  dayEnd: string = '20:00'
): number {
  const t = parseTime(time);
  const start = parseTime(dayStart);
  const end = parseTime(dayEnd);

  const totalMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
  const elapsedMinutes = (t.hours * 60 + t.minutes) - (start.hours * 60 + start.minutes);

  return Math.max(0, Math.min(100, (elapsedMinutes / totalMinutes) * 100));
}

export function durationToPercent(
  start: string,
  end: string,
  dayStart: string = '08:00',
  dayEnd: string = '20:00'
): number {
  const startPct = timeToPercent(start, dayStart, dayEnd);
  const endPct = timeToPercent(end, dayStart, dayEnd);
  return endPct - startPct;
}