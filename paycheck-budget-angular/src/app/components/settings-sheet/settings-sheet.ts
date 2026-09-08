import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayFrequency } from '../../models/budget.model';
import { Budget } from '../../services/budget';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-settings-sheet',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-sheet.html',
  styleUrl: './settings-sheet.css',
})
export class SettingsSheet {
  protected readonly budget = inject(Budget);
  protected readonly uiState = inject(UiState);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0)]],
    frequency: ['biweekly' as PayFrequency, Validators.required],
    nextDate: ['', Validators.required],
  });

  constructor() {
    // Re-fill the form with the current paycheck every time this sheet opens,
    // so edits from a previous visit never leak into the next one.
    effect(() => {
      if (this.uiState.openSheet() === 'settings') {
        const paycheck = this.budget.paycheck();
        this.form.reset({
          amount: paycheck.amount,
          frequency: paycheck.frequency,
          nextDate: paycheck.nextDate,
        });
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { amount, frequency, nextDate } = this.form.getRawValue();
    this.budget.updatePaycheck(amount, frequency, nextDate);
    this.uiState.closeSheet();
    this.uiState.showToast('Paycheck settings saved.');
  }

  protected resetApp(): void {
    const confirmed = confirm(
      'This clears every envelope, transaction and history entry and reloads the sample budget. Continue?',
    );
    if (!confirmed) return;
    this.budget.resetToSample();
    this.uiState.closeSheet();
    this.uiState.showToast('Starting fresh.');
  }
}
