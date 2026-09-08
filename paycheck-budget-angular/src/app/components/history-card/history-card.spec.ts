import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryEntry } from '../../models/budget.model';
import { HistoryCard } from './history-card';

const sampleEntry: HistoryEntry = {
  paidDate: '2026-08-22',
  income: 1850,
  allocated: 1730,
  spent: 1698.4,
};

describe('HistoryCard', () => {
  let component: HistoryCard;
  let fixture: ComponentFixture<HistoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryCard);
    fixture.componentRef.setInput('entry', sampleEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is not overspent when spent is below allocated', () => {
    expect(component['overspent']()).toBe(false);
  });
});
