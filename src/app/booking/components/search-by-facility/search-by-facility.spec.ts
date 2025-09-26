import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByFacility } from './search-by-facility';

describe('SearchByFacility', () => {
  let component: SearchByFacility;
  let fixture: ComponentFixture<SearchByFacility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByFacility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchByFacility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
