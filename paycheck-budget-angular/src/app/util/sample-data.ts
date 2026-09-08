import { BudgetState, Envelope, Transaction } from '../models/budget.model';

let counter = 0;
/** Small, dependency-free id generator — good enough for client-only data. */
export function nextId(): string {
  counter += 1;
  return `${Date.now().toString(36)}${counter}`;
}

export function makeTransaction(note: string, amount: number): Transaction {
  return { id: nextId(), note, amount };
}

export function makeEnvelope(
  name: string,
  allocated: number,
  rollover: boolean,
  transactions: Transaction[],
): Envelope {
  const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
  return { id: nextId(), name, target: allocated, allocated, spent, rollover, transactions };
}

/** A realistic starter budget so the app is useful the moment it loads. */
export function sampleState(): BudgetState {
  return {
    paycheck: { amount: 1850, frequency: 'biweekly', nextDate: '2026-09-19' },
    envelopes: [
      makeEnvelope('Rent & Utilities', 900, false, [
        makeTransaction('Rent — Sept', 850),
        makeTransaction('Electric bill', 50),
      ]),
      makeEnvelope('Groceries', 280, false, [
        makeTransaction("Trader Joe's", 54.12),
        makeTransaction('Costco run', 78.2),
        makeTransaction('Corner store', 32.0),
      ]),
      makeEnvelope('Gas & Transit', 120, false, [
        makeTransaction('Shell fill-up', 48.1),
        makeTransaction('Metro card', 48.0),
      ]),
      makeEnvelope('Savings', 250, false, [makeTransaction('Auto-transfer to savings', 250)]),
      makeEnvelope('Fun Money', 80, true, [
        makeTransaction('Movie night', 32.5),
        makeTransaction('Concert tickets', 56.0),
      ]),
      makeEnvelope('Subscriptions', 100, false, [makeTransaction('Streaming bundle', 24.99)]),
    ],
    history: [{ paidDate: '2026-08-22', income: 1850, allocated: 1730, spent: 1698.4 }],
  };
}
