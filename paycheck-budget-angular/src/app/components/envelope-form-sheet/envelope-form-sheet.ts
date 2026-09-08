import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget } from '../../services/budget';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-envelope-form-sheet',
  imports: [ReactiveFormsModule],
  templateUrl: './envelope-form-sheet.html',
  styleUrl: './envelope-form-sheet.css',
})
export class EnvelopeFormSheet {
  protected readonly budget = inject(Budget);
  protected readonly uiState = inject(UiState);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isEditing = computed(() => this.uiState.editingEnvelope() !== null);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(24)]],
    allocated: [0, [Validators.required, Validators.min(0)]],
    rollover: [false],
  });

  constructor() {
    effect(() => {
      if (this.uiState.openSheet() === 'envelope-form') {
        const editing = this.uiState.editingEnvelope();
        this.form.reset(
          editing
            ? { name: editing.name, allocated: editing.allocated, rollover: editing.rollover }
            : { name: '', allocated: 0, rollover: false },
        );
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { name, allocated, rollover } = this.form.getRawValue();
    const editing = this.uiState.editingEnvelope();
    if (editing) {
      this.budget.updateEnvelope(editing.id, name, allocated, rollover);
    } else {
      this.budget.addEnvelope(name, allocated, rollover);
    }
    this.uiState.closeSheet();
  }

  protected remove(): void {
    const editing = this.uiState.editingEnvelope();
    if (!editing) return;
    if (!confirm(`Delete "${editing.name}"?`)) return;
    this.budget.deleteEnvelope(editing.id);
    this.uiState.collapse();
    this.uiState.closeSheet();
  }
}
