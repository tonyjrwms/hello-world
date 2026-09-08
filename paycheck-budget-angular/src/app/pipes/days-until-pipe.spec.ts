import { toIsoDate } from '../util/date-utils';
import { DaysUntilPipe } from './days-until-pipe';

function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

describe('DaysUntilPipe', () => {
  const pipe = new DaysUntilPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('labels today as "today"', () => {
    expect(pipe.transform(isoDaysFromNow(0))).toBe('today');
  });

  it('labels a date one day out as "in 1 day"', () => {
    expect(pipe.transform(isoDaysFromNow(1))).toBe('in 1 day');
  });

  it('labels a date several days out with the count', () => {
    expect(pipe.transform(isoDaysFromNow(11))).toBe('in 11 days');
  });

  it('labels a past date as "overdue"', () => {
    expect(pipe.transform(isoDaysFromNow(-1))).toBe('overdue');
  });
});
