import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewShop, Shop } from '../../../service/shop.model';

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-dialog.html',
  styleUrl: './shop-dialog.css'
})
export class ShopDialog {
  @Input() formTitle = 'Form';
  @Input() submitLabel = 'Submit';
  @Input() initialData: Partial<Shop> = {};
  @Input() formMode: string = 'CREATE';

  formData: Shop = {
    ...NewShop
  };

  @Output() formSubmitted = new EventEmitter<any>();

  ngOnChanges() {
    this.formData = { ...this.formData,
      ...this.initialData
     }
  }

  open() {
    const dialog = document.getElementById('dynamic_form_modal') as HTMLDialogElement;
    dialog?.showModal();
  }

  close() {
    const dialog = document.getElementById('dynamic_form_modal') as HTMLDialogElement;
    dialog?.close();
  }

  handleSubmit() {
    this.formSubmitted.emit({
      formData: this.formData,
      formMode: this.formMode
    });
    this.close();
  }

  handleDelete() {
    this.formSubmitted.emit({
      id: this.formData.id,
      formMode: 'DELETE',
    });
    this.close();
  }
}
