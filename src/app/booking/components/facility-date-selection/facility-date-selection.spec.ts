import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityDateSelection } from './facility-date-selection';

describe('FacilityDateSelection', () => {
  let component: FacilityDateSelection;
  let fixture: ComponentFixture<FacilityDateSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityDateSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityDateSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
