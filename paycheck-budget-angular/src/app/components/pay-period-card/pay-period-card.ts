import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PayFrequency } from '../../models/budget.model';
import { DaysUntilPipe } from '../../pipes/days-until-pipe';
import { Budget } from '../../services/budget';
import { UiState } from '../../services/ui-state';

const FREQUENCY_LABEL: Record<PayFrequency, string> = {
  weekly: 'weekly',
  biweekly: 'biweekly',
  semimonthly: 'twice a month',
  monthly: 'monthly',
};

@Component({
  selector: 'app-pay-period-card',
  imports: [CurrencyPipe, DatePipe, DaysUntilPipe],
  templateUrl: './pay-period-card.html',
  styleUrl: './pay-period-card.css',
})
export class PayPeriodCard {
  protected readonly budget = inject(Budget);
  protected readonly uiState = inject(UiState);

  /** Templates can't reach the global `Math` object, so we expose it here. */
  protected readonly Math = Math;

  protected readonly frequencyLabel = computed(
    () => FREQUENCY_LABEL[this.budget.paycheck().frequency],
  );

  protected gotPaid(): void {
    this.budget.gotPaid();
    this.uiState.showToast('Paycheck logged — envelopes are refilled for the new period.');
  }
}
