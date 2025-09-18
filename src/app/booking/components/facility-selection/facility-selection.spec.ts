import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySelection } from './facility-selection';

describe('FacilitySelection', () => {
  let component: FacilitySelection;
  let fixture: ComponentFixture<FacilitySelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitySelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitySelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
