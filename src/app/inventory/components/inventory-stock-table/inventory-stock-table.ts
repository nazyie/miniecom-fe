import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { InventoryStock } from '../../model/inventory-modal';

@Component({
  selector: 'app-inventory-stock-table',
  imports: [],
  templateUrl: './inventory-stock-table.html',
  styleUrl: './inventory-stock-table.css'
})
export class InventoryStockTable {
  @Input() inventoryId?: string;

  @Output() recordAction = new EventEmitter<{action: string, data: any}>();

  result: InventoryStock [] = [];

  constructor(
    private inventoryService: InventoryService
  ) {}

  loadData() {
    if (this.inventoryId) {
      this.inventoryService.getVariant(this.inventoryId).subscribe({
        next: (result) => {
          this.result = result;
        }
      })
    }
  }

  edit(data: InventoryStock) {
    this.recordAction.emit({
      action: 'MODIFY',
      data: data,
    });
  }
  
  deleteRecord(id: string) {
    this.recordAction.emit({
      action: 'DELETE',
      data: id
    });
  }
}
