import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsLayout } from './cms-layout';

describe('CmsLayout', () => {
  let component: CmsLayout;
  let fixture: ComponentFixture<CmsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
