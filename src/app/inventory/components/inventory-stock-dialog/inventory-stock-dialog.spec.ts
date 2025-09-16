import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockDialog } from './inventory-stock-dialog';

describe('InventoryStockDialog', () => {
  let component: InventoryStockDialog;
  let fixture: ComponentFixture<InventoryStockDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryStockDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryStockDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
