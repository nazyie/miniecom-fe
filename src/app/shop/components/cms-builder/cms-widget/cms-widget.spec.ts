import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsWidget } from './cms-widget';

describe('CmsWidget', () => {
  let component: CmsWidget;
  let fixture: ComponentFixture<CmsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
