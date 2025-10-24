import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogue } from '../../model/catalogue-modal';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { CatalogueDialogDetail } from "../catalogue-dialog-detail/catalogue-dialog-detail";
import { CatalogueDialogTime } from "../catalogue-dialog-time/catalogue-dialog-time";
import { CatalogueDialogAttachment } from "../catalogue-dialog-attachment/catalogue-dialog-attachment";
import { CatalogueDialogPricingPlan } from "../catalogue-dialog-pricing-plan/catalogue-dialog-pricing-plan";
import { ToastService } from '../../../common/services/toast-service';
import { ResponseText } from '../../../common/constant/response';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';

@Component({
  selector: 'app-catalogue-dialog',
  imports: [CatalogueDialogDetail, CatalogueDialogTime, CatalogueDialogAttachment, CatalogueDialogPricingPlan],
  templateUrl: './catalogue-dialog.html',
  styleUrl: './catalogue-dialog.css'
})
export class CatalogueDialog implements OnInit {
  @Input() formTitle: string = 'Cipta Catalogue';
  @Input() submitLabel: string = 'Cipta';
  @Input() formMode: string = 'CREATE';
  @Input() record: Catalogue | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  formNavigationCount: number = 0;

  constructor(
    private cataloguePageService: CataloguePageService,
    private toastService: ToastService,
    private shopNavigatorService: ShopNavigatorService
  ) {}

  ngOnInit(): void {
    this.cataloguePageService.constructCatalogueValue(this.record, this.getItemType());
  }

  navigatePage(pageIndex: number) {
    if (pageIndex === 1 && !this.isAllowedToConfigTime()) {
      this.toastService.warning('Sila lengkapkan maklumat utama dan tekan butang cipta', 4000);
      return;
    }

    if (pageIndex === 2 && !this.isAllowedToConfigImage()) {
      this.toastService.warning('Sila lengkapkan maklumat utama dan tekan butang cipta', 4000);
      return;
    }

    if (pageIndex === 3 && !this.isAllowedToConfigPrice()) {
      this.toastService.warning('Sila lengkapkan maklumat utama dan tekan butang cipta', 4000);
      return;
    }

    this.formNavigationCount = pageIndex;
  }

  isAllowedToConfigTime() : boolean {
    return true;
  }

  isAllowedToConfigImage() {
    return this.cataloguePageService.catalogue?.id ? true: false;
  }

  isAllowedToConfigPrice() {
    return this.cataloguePageService.catalogue?.id ? true: false;
  }

  submit() {
    let payload = this.cataloguePageService.catalogue;
    if (this.formMode == 'CREATE' && payload) {
      // defaulted display to false

      payload.publish = false;

      this.formSubmitted.emit({
        formMode: this.formMode,
        data: payload
      });
    } else {
      if (this.performValidation()) {
        this.formSubmitted.emit({
          formMode: this.formMode,
          data: payload
        });
      }
    }
  }

  private performValidation(): boolean {
      const payload = this.cataloguePageService.catalogue;

      // validate the price
      if (payload?.facility?.price == null || payload?.facility?.price == '0') {
        this.promptErrorMessage('harga', 'pelan harga');
        return false;
      }

      // validate the product name
      if (payload?.name == null || payload?.name == '') {
        this.promptErrorMessage('nama produk', 'maklumat utama');
        return false;
      }

      // validate the time configuration
      if (payload?.facility.bookingFrequency == null || payload?.facility.bookingFrequency == '') {
        this.promptErrorMessage('frekuensi penggunaan fasiliti', 'tetapan masa');
        return false;
      }
      if (payload?.facility.openingTime == null || payload?.facility.openingTime == '') {
        this.promptErrorMessage('waktu mula', 'tetapan masa');
        return false;
      }
      if (payload?.facility.closingTime == null || payload?.facility.closingTime == '') {
        this.promptErrorMessage('waktu akhir', 'tetapan masa');
        return false;
      }

      return true;
  }

  private getItemType(): string {
    return this.shopNavigatorService.shopType == 'Booking Sistem' ? 'FACILITY' : 'INVENTORY';
  }

  private promptErrorMessage(fieldName: string, targetTab: string) {
    return this.toastService.error(`${ResponseText.ERR_FIELD_REQUIRED} ${fieldName} di bahagian ${targetTab}`, 4000);
  } 

  delete() {
    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: this.record?.id
    });
  }

  close() {
    const isNewRecord = this.cataloguePageService.catalogue?.id === '' ? true : false;

    if (isNewRecord || this.performValidation()) {
      this.formSubmitted.emit({
        formMode: 'CANCEL',
        data: null
      })
    }
  }

}
