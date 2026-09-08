import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Envelope } from '../../models/budget.model';
import { EnvelopeItem } from './envelope-item';

const sampleEnvelope: Envelope = {
  id: 'env-1',
  name: 'Groceries',
  target: 280,
  allocated: 280,
  spent: 164.32,
  rollover: false,
  transactions: [{ id: 'tx-1', note: "Trader Joe's", amount: 54.12 }],
};

describe('EnvelopeItem', () => {
  let component: EnvelopeItem;
  let fixture: ComponentFixture<EnvelopeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvelopeItem],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopeItem);
    fixture.componentRef.setInput('envelope', sampleEnvelope);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the envelope name', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Groceries');
  });

  it('emits toggle when the header is clicked', () => {
    let toggled = false;
    component.toggle.subscribe(() => (toggled = true));
    (fixture.nativeElement as HTMLElement).querySelector('.envelope-head')?.dispatchEvent(new Event('click'));
    expect(toggled).toBe(true);
  });
});
