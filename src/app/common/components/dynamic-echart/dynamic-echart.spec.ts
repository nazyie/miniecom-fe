import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEchart } from './dynamic-echart';

describe('DynamicEchart', () => {
  let component: DynamicEchart;
  let fixture: ComponentFixture<DynamicEchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicEchart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicEchart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
