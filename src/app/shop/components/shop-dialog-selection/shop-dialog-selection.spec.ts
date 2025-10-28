import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDialogSelection } from './shop-dialog-selection';

describe('ShopDialogSelection', () => {
  let component: ShopDialogSelection;
  let fixture: ComponentFixture<ShopDialogSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDialogSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDialogSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
