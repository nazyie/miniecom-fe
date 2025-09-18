import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommercePage } from './ecommerce-page';

describe('EcommercePage', () => {
  let component: EcommercePage;
  let fixture: ComponentFixture<EcommercePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcommercePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcommercePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
