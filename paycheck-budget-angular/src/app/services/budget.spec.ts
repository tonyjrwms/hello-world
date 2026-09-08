import { TestBed } from '@angular/core/testing';
import { Budget } from './budget';

describe('Budget', () => {
  let budget: Budget;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    budget = TestBed.inject(Budget);
  });

  it('starts with the sample paycheck and envelopes', () => {
    expect(budget.paycheck().amount).toBe(1850);
    expect(budget.envelopes().length).toBeGreaterThan(0);
  });

  it('logging an expense increases that envelope\'s spent total', () => {
    const [envelope] = budget.envelopes();
    const before = envelope.spent;

    budget.addExpense(envelope.id, 12.5, 'Coffee');

    const after = budget.envelopes().find((e) => e.id === envelope.id);
    expect(after?.spent).toBeCloseTo(before + 12.5);
    expect(after?.transactions.at(-1)?.note).toBe('Coffee');
  });

  it('deleting a transaction removes it from the total', () => {
    const [envelope] = budget.envelopes();
    budget.addExpense(envelope.id, 20, 'Test charge');
    const withCharge = budget.envelopes().find((e) => e.id === envelope.id)!;
    const transaction = withCharge.transactions.at(-1)!;

    budget.deleteTransaction(envelope.id, transaction.id);

    const after = budget.envelopes().find((e) => e.id === envelope.id);
    expect(after?.spent).toBeCloseTo(withCharge.spent - 20);
    expect(after?.transactions.find((t) => t.id === transaction.id)).toBeUndefined();
  });

  it('a non-rollover envelope resets to its target amount after getting paid', () => {
    const [envelope] = budget.envelopes();
    budget.addExpense(envelope.id, 5, 'Snack');

    budget.gotPaid();

    const refilled = budget.envelopes().find((e) => e.id === envelope.id);
    expect(refilled?.spent).toBe(0);
    expect(refilled?.allocated).toBe(envelope.target);
  });

  it('a rollover envelope carries its leftover into the next allocation', () => {
    budget.addEnvelope('Hobbies', 100, true);
    const envelope = budget.envelopes().find((e) => e.name === 'Hobbies')!;
    budget.addExpense(envelope.id, 40, 'Yarn');

    budget.gotPaid();

    const refilled = budget.envelopes().find((e) => e.id === envelope.id);
    // 100 target + (100 allocated - 40 spent) leftover = 160
    expect(refilled?.allocated).toBe(160);
  });

  it('getting paid archives the closed period to history', () => {
    const historyBefore = budget.history().length;

    budget.gotPaid();

    expect(budget.history().length).toBe(historyBefore + 1);
  });
});
