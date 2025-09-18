import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityConfirmation } from './facility-confirmation';

describe('FacilityConfirmation', () => {
  let component: FacilityConfirmation;
  let fixture: ComponentFixture<FacilityConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
