import { Pipe, PipeTransform } from '@angular/core';
import { daysUntil } from '../util/date-utils';

/**
 * A pure pipe: given the same ISO date string, it always returns the same
 * label, so Angular only re-runs it when the input actually changes.
 * Usage in a template: `{{ paycheck().nextDate | daysUntil }}`.
 */
@Pipe({ name: 'daysUntil' })
export class DaysUntilPipe implements PipeTransform {
  transform(iso: string): string {
    const days = daysUntil(iso);
    if (days < 0) return 'overdue';
    if (days === 0) return 'today';
    if (days === 1) return 'in 1 day';
    return `in ${days} days`;
  }
}
