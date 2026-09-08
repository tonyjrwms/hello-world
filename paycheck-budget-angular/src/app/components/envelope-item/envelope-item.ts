import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Envelope, envelopeStatus } from '../../models/budget.model';

export interface AddExpensePayload {
  amount: number;
  note: string;
}

/**
 * A "dumb" presentational component: it never touches a service. It only
 * reads the `envelope` and `expanded` inputs it's given and reports what
 * happened through outputs, leaving the parent (`EnvelopesPage`) to decide
 * what those events actually mean for the app's state.
 */
@Component({
  selector: 'app-envelope-item',
  imports: [CurrencyPipe],
  templateUrl: './envelope-item.html',
  styleUrl: './envelope-item.css',
})
export class EnvelopeItem {
  readonly envelope = input.required<Envelope>();
  readonly expanded = input(false);

  readonly toggle = output<void>();
  readonly addExpense = output<AddExpensePayload>();
  readonly deleteTransaction = output<string>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly status = computed(() => envelopeStatus(this.envelope()));
  protected readonly remaining = computed(() => this.envelope().allocated - this.envelope().spent);
  protected readonly percentSpent = computed(() => {
    const envelope = this.envelope();
    if (envelope.allocated <= 0) return envelope.spent > 0 ? 100 : 0;
    return Math.min(100, (envelope.spent / envelope.allocated) * 100);
  });
  protected readonly recentFirst = computed(() => [...this.envelope().transactions].reverse());

  protected onAddExpense(amountValue: string, noteValue: string, form: HTMLFormElement): void {
    const amount = parseFloat(amountValue);
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.addExpense.emit({ amount, note: noteValue.trim() });
    form.reset();
  }
}
