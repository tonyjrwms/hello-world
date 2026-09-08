/**
 * Plain data shapes for the app. Angular doesn't need these to be classes —
 * interfaces are enough, and keeping them framework-free makes them easy to
 * unit test and to serialize straight to `localStorage`.
 */

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export interface Transaction {
  id: string;
  note: string;
  amount: number;
}

export interface Envelope {
  id: string;
  name: string;
  /** The amount the user intends per paycheck — the anchor rollover math resets to. */
  target: number;
  /** This period's working amount (equals target, unless rollover adjusted it). */
  allocated: number;
  spent: number;
  /** When true, leftover (or overspend) carries into the next paycheck's allocation. */
  rollover: boolean;
  transactions: Transaction[];
}

export interface Paycheck {
  amount: number;
  frequency: PayFrequency;
  /** ISO date string, e.g. "2026-09-19". */
  nextDate: string;
}

export interface HistoryEntry {
  paidDate: string;
  income: number;
  allocated: number;
  spent: number;
}

export interface BudgetState {
  paycheck: Paycheck;
  envelopes: Envelope[];
  history: HistoryEntry[];
}

export type EnvelopeStatus = 'ok' | 'warning' | 'critical';

/** Under 80% spent is fine, 80-100% is a warning, over 100% is critical. */
export function envelopeStatus(envelope: Envelope): EnvelopeStatus {
  if (envelope.allocated <= 0) {
    return envelope.spent > 0 ? 'critical' : 'ok';
  }
  const ratio = envelope.spent / envelope.allocated;
  if (ratio > 1) return 'critical';
  if (ratio >= 0.8) return 'warning';
  return 'ok';
}
