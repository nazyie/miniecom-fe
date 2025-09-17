import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryService } from '../../services/catalogue-service';
import { CatalogueVariant } from '../../model/catalogue-modal';

@Component({
  selector: 'app-catalogue-variant-table',
  imports: [],
  templateUrl: './catalogue-variant-table.html',
  styleUrl: './catalogue-variant-table.css'
})
export class InventoryStockTable {
  @Input() inventoryId?: string;

  @Output() recordAction = new EventEmitter<{action: string, data: any}>();

  result: CatalogueVariant [] = [];

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

  edit(data: CatalogueVariant) {
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
