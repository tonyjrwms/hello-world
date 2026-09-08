import { Service, computed, effect, signal } from '@angular/core';
import { BudgetState, Envelope, HistoryEntry, PayFrequency } from '../models/budget.model';
import { advancePayDate } from '../util/date-utils';
import { makeEnvelope, makeTransaction, sampleState } from '../util/sample-data';

const STORAGE_KEY = 'paycheckLedger.angular.v1';

function loadInitialState(): BudgetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BudgetState;
  } catch {
    // Storage can be unavailable (private browsing, disabled cookies) — fall back below.
  }
  return sampleState();
}

/**
 * Owns the budget's state as a single signal and every operation that
 * changes it. Components never mutate state directly; they call a method
 * here, which replaces the signal's value with a new object. Reading
 * `state()` (or one of the `computed` signals below) inside a template or
 * an `effect` automatically subscribes to updates — no manual change
 * detection wiring needed.
 */
@Service()
export class Budget {
  private readonly state = signal<BudgetState>(loadInitialState());

  readonly paycheck = computed(() => this.state().paycheck);
  readonly envelopes = computed(() => this.state().envelopes);
  readonly history = computed(() => this.state().history);

  readonly totals = computed(() => {
    const envelopes = this.envelopes();
    const allocated = envelopes.reduce((sum, e) => sum + e.allocated, 0);
    const spent = envelopes.reduce((sum, e) => sum + e.spent, 0);
    return {
      allocated,
      spent,
      left: allocated - spent,
      unallocated: this.paycheck().amount - allocated,
    };
  });

  constructor() {
    // Persist to localStorage any time the state changes, for any reason.
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
      } catch {
        // Ignore — e.g. storage quota exceeded or unavailable.
      }
    });
  }

  updatePaycheck(amount: number, frequency: PayFrequency, nextDate: string): void {
    this.state.update((s) => ({ ...s, paycheck: { amount, frequency, nextDate } }));
  }

  addEnvelope(name: string, allocated: number, rollover: boolean): void {
    const envelope = makeEnvelope(name, allocated, rollover, []);
    this.state.update((s) => ({ ...s, envelopes: [...s.envelopes, envelope] }));
  }

  updateEnvelope(id: string, name: string, allocated: number, rollover: boolean): void {
    this.state.update((s) => ({
      ...s,
      envelopes: s.envelopes.map((e) =>
        e.id === id ? { ...e, name, allocated, target: allocated, rollover } : e,
      ),
    }));
  }

  deleteEnvelope(id: string): void {
    this.state.update((s) => ({ ...s, envelopes: s.envelopes.filter((e) => e.id !== id) }));
  }

  addExpense(envelopeId: string, amount: number, note: string): void {
    this.state.update((s) => ({
      ...s,
      envelopes: s.envelopes.map((e) =>
        e.id === envelopeId
          ? {
              ...e,
              spent: e.spent + amount,
              transactions: [...e.transactions, makeTransaction(note || 'Expense', amount)],
            }
          : e,
      ),
    }));
  }

  deleteTransaction(envelopeId: string, transactionId: string): void {
    this.state.update((s) => ({
      ...s,
      envelopes: s.envelopes.map((e) => {
        if (e.id !== envelopeId) return e;
        const tx = e.transactions.find((t) => t.id === transactionId);
        if (!tx) return e;
        return {
          ...e,
          spent: e.spent - tx.amount,
          transactions: e.transactions.filter((t) => t.id !== transactionId),
        };
      }),
    }));
  }

  /** Closes out the current pay period: archives it, refills every envelope, advances payday. */
  gotPaid(): void {
    this.state.update((s) => {
      const allocated = s.envelopes.reduce((sum, e) => sum + e.allocated, 0);
      const spent = s.envelopes.reduce((sum, e) => sum + e.spent, 0);
      const closedPeriod: HistoryEntry = {
        paidDate: s.paycheck.nextDate,
        income: s.paycheck.amount,
        allocated,
        spent,
      };
      const refilled: Envelope[] = s.envelopes.map((e) => {
        const leftover = e.allocated - e.spent;
        const nextAllocated = e.rollover ? Math.max(0, e.target + leftover) : e.target;
        return { ...e, allocated: nextAllocated, spent: 0, transactions: [] };
      });
      return {
        paycheck: { ...s.paycheck, nextDate: advancePayDate(s.paycheck.nextDate, s.paycheck.frequency) },
        envelopes: refilled,
        history: [...s.history, closedPeriod],
      };
    });
  }

  resetToSample(): void {
    this.state.set(sampleState());
  }
}
