import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsSheet } from './settings-sheet';

describe('SettingsSheet', () => {
  let component: SettingsSheet;
  let fixture: ComponentFixture<SettingsSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
