import { PayFrequency } from '../models/budget.model';

/** Parses an ISO "YYYY-MM-DD" string as a local-time date (avoids UTC off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseIsoDate(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Advances a payday by one pay period, given the chosen frequency. */
export function advancePayDate(iso: string, frequency: PayFrequency): string {
  const date = parseIsoDate(iso);
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'semimonthly':
      if (date.getDate() < 15) {
        date.setDate(15);
      } else {
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
      }
      break;
  }
  return toIsoDate(date);
}
