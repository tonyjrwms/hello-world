import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvelopeFormSheet } from './envelope-form-sheet';

describe('EnvelopeFormSheet', () => {
  let component: EnvelopeFormSheet;
  let fixture: ComponentFixture<EnvelopeFormSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvelopeFormSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopeFormSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
