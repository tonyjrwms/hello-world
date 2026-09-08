import { Component, inject } from '@angular/core';
import { AddExpensePayload, EnvelopeItem } from '../../components/envelope-item/envelope-item';
import { Envelope } from '../../models/budget.model';
import { Budget } from '../../services/budget';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-envelopes-page',
  imports: [EnvelopeItem],
  templateUrl: './envelopes-page.html',
  styleUrl: './envelopes-page.css',
})
export class EnvelopesPage {
  protected readonly budget = inject(Budget);
  protected readonly uiState = inject(UiState);

  protected onAddExpense(envelopeId: string, payload: AddExpensePayload): void {
    this.budget.addExpense(envelopeId, payload.amount, payload.note);
  }

  protected onRemove(envelope: Envelope): void {
    const confirmed = confirm(`Delete "${envelope.name}"? This removes its spending history too.`);
    if (!confirmed) return;
    this.budget.deleteEnvelope(envelope.id);
    this.uiState.collapse();
  }
}
