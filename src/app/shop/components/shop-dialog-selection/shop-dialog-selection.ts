import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Shop } from '../../model/shop.model';

@Component({
  selector: 'app-shop-dialog-selection',
  imports: [],
  templateUrl: './shop-dialog-selection.html',
  styleUrl: './shop-dialog-selection.css'
})
export class ShopDialogSelection {
  formTitle: string = 'Pilih';

  @Input() record!: Shop | undefined | null;
  @Output() option = new EventEmitter<{ data: any, mode: string }>();

  selectOption(option: string) {
    switch (option) {
      case 'close':
        this.option.emit({
          data: null,
          mode: option
        })
        break;
      default:
        this.option.emit({
          data: this.record,
          mode: option
        });
    }
  }

}
