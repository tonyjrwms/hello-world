import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HistoryEntry } from '../../models/budget.model';

@Component({
  selector: 'app-history-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './history-card.html',
  styleUrl: './history-card.css',
})
export class HistoryCard {
  readonly entry = input.required<HistoryEntry>();

  protected readonly percentSpent = computed(() => {
    const entry = this.entry();
    return entry.allocated > 0 ? Math.min(100, (entry.spent / entry.allocated) * 100) : 0;
  });
  protected readonly overspent = computed(() => this.entry().spent > this.entry().allocated);
  protected readonly left = computed(() => this.entry().allocated - this.entry().spent);
}
