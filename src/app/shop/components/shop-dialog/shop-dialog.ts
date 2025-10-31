import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Shop } from '../../model/shop.model';
import { ShopService } from '../../services/shop-service';
import { ShopStateService } from '../../services/shop-state-service';
import { ShopDetail } from './shop-detail/shop-detail';
import { ShopOrdering } from "./shop-ordering/shop-ordering";
import { ShopPayment } from "./shop-payment/shop-payment";

export enum SHOP_STATUS {
  ACTIVE,
  DEACTIVE
}

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [ShopDetail, ShopOrdering, ShopPayment],
  templateUrl: './shop-dialog.html',
  styleUrl: './shop-dialog.css'
})
export class ShopDialog implements OnInit {
  @Input() formTitle!: string;
  @Input() submitLabel!: string;
  @Input() formMode!: string;
  @Input() record: Shop | undefined | null;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  form: FormGroup = new FormGroup({});

  pageIndex: number = 0;

  constructor(
    private sss: ShopStateService
  ) { }

  ngOnInit(): void {
    if (this.record) {
      this.sss.updateShop(this.record);
    } else {
    }
  }

  navigatePage(pageIndex: number) : void {
    this.pageIndex = pageIndex;
  }

  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as Shop;

      this.formSubmitted.emit({
        formMode: this.formMode,
        data: formRequest
      });
    } else {
      console.log('Form not valid');
    }
  }

  delete() {
    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: this.form.controls['id'].value
    });
  }

  close() {
    this.formSubmitted.emit({
      formMode: 'cancel',
      data: null
    })
  }

}
