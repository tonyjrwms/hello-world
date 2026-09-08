import { Component, computed, inject } from '@angular/core';
import { HistoryCard } from '../../components/history-card/history-card';
import { Budget } from '../../services/budget';

@Component({
  selector: 'app-history-page',
  imports: [HistoryCard],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export class HistoryPage {
  protected readonly budget = inject(Budget);

  /** Most recent paycheck first. */
  protected readonly recentFirst = computed(() => [...this.budget.history()].reverse());
}
