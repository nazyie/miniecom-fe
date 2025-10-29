import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseFacility } from '../../model/booking-page.model';
import { BookingService } from '../../service/booking-service';
import { FacilityCartService } from '../../service/facility-cart-service';
import { FacilityAttachment } from "./facility-attachment/facility-attachment";
import { FacilityPrice } from './facility-price/facility-price';

@Component({
  selector: 'app-facility-selection',
  imports: [FacilityAttachment, FacilityPrice],
  templateUrl: './facility-selection.html',
  styleUrl: './facility-selection.css'
})
export class FacilitySelection implements OnInit {
  facilityList: ResponseFacility[] | null = null;
  isAttachmentDialogOpen: boolean = false;
  isPricingDialogOpen: boolean = false;

  openAttachmentId: string = '';
  openRecord: ResponseFacility | null = null;


  constructor(
    private bookingService: BookingService,
    private facilityCartService: FacilityCartService,
  ) { }

  ngOnInit(): void {
    this.loadFacility();
  }

  isSelectedFacility(facilityId: string): boolean {
    const selectedId =  this.facilityCartService.getMetadata().facilityId;
    return selectedId === facilityId;
  }

  loadFacility() {
    this.bookingService.getFacility().subscribe({
      next: (res) => {
        this.facilityList = res;
      }
    });
  }

  selectFacility(item: ResponseFacility) {
    if (!item) return;

    const currentCart = this.facilityCartService.getMetadata();

    const updatedCart = {
      ...currentCart,
      facilityId: item.facilityId,
      facilityName: item.facilityName,
      bookingFrequency: item.bookingFrequency,
      price: item.price ?? 0,
      openingTime: item.openingTime,
      closingTime: item.closingTime,
    };

    const hasChanged = Object.keys(updatedCart).some(
      key => (updatedCart as any)[key] !== (currentCart as any)[key]
    );

    if (hasChanged) {
      this.facilityCartService.cleanMetadata();
      this.facilityCartService.updateMetadata(updatedCart);
    }
  }

  openAttachment(catalogueId: string) {
    this.openAttachmentId= catalogueId;
    this.isAttachmentDialogOpen = true;
  }

  handleAttachmentClosingDialog(isClosingAction: boolean) {
    this.openAttachmentId = '';
    this.isAttachmentDialogOpen = false;
  }

  openPricing(facility : ResponseFacility) {
    this.openRecord = facility;
    this.isPricingDialogOpen = true;
  }

  handlePriceClosingDialog(isClosingAction: boolean)  {
    this.openRecord = null;
    this.isPricingDialogOpen = false;
  }

  getAttachmentPath(path: string) {
    return this.bookingService.getAttachmentAssetPath(path);
  }

}
