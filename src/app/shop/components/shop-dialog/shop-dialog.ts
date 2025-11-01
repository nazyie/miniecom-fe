import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shop } from '../../model/shop.model';
import { ShopStateService } from '../../services/shop-state-service';
import { ShopDetail } from './shop-detail/shop-detail';
import { ShopOrdering } from "./shop-ordering/shop-ordering";
import { ShopPayment } from "./shop-payment/shop-payment";
import { ToastService } from '../../../common/services/toast-service';

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

  pageIndex: number = 0;

  constructor(
    private sss: ShopStateService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.sss.constructShop(this.record);
  }

  navigatePage(pageIndex: number) : void {
    this.pageIndex = pageIndex;
  }

  submit() {
    const shop = this.sss.getShop();

    if (!shop.enableCashOnArrival && !shop.enableReceiptUpload) {
      this.toastService.error('Sila pilih tetapan pembayaran untuk menyimpan maklumat');
      return;
    }

    this.formSubmitted.emit({
      formMode: this.formMode,
      data: shop
    });
  }

  delete() {
    const shop = this.sss.getShop();

    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: shop.id
    });
  }

  close() {
    this.formSubmitted.emit({
      formMode: 'cancel',
      data: null
    })
  }

}
