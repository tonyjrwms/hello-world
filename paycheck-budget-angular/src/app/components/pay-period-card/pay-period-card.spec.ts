import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayPeriodCard } from './pay-period-card';

describe('PayPeriodCard', () => {
  let component: PayPeriodCard;
  let fixture: ComponentFixture<PayPeriodCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPeriodCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PayPeriodCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
