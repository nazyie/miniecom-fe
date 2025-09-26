import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByDate } from './search-by-date';

describe('SearchByDate', () => {
  let component: SearchByDate;
  let fixture: ComponentFixture<SearchByDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchByDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
