import { Service, signal } from '@angular/core';
import { Envelope } from '../models/budget.model';

export type SheetName = 'settings' | 'envelope-form' | null;

/**
 * UI-only state that several unrelated components need to share (which
 * overlay sheet is open, which envelope is expanded, the current toast
 * message). None of this belongs in `Budget` — it has nothing to do with
 * the user's actual data — so it gets its own small service instead.
 */
@Service()
export class UiState {
  readonly openSheet = signal<SheetName>(null);
  readonly editingEnvelope = signal<Envelope | null>(null);
  readonly expandedEnvelopeId = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);

  private toastTimer?: ReturnType<typeof setTimeout>;

  openSettingsSheet(): void {
    this.openSheet.set('settings');
  }

  openEnvelopeForm(envelope: Envelope | null): void {
    this.editingEnvelope.set(envelope);
    this.openSheet.set('envelope-form');
  }

  closeSheet(): void {
    this.openSheet.set(null);
    this.editingEnvelope.set(null);
  }

  toggleExpanded(envelopeId: string): void {
    this.expandedEnvelopeId.update((current) => (current === envelopeId ? null : envelopeId));
  }

  /** Collapses whichever envelope is expanded — used after deleting one. */
  collapse(): void {
    this.expandedEnvelopeId.set(null);
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), 3200);
  }
}
