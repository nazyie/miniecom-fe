import { Component, OnInit, ViewChild } from '@angular/core';
import { FacilityAttachment } from "./facility-attachment/facility-attachment";
import { FacilityPrice } from './facility-price/facility-price';
import { ResponseFacility } from '../../../model/booking-page.model';
import { BookingService } from '../../../service/booking-service';
import { FacilityCartService } from '../../../service/facility-cart-service';

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
    private bs: BookingService,
    private facilityCartService: FacilityCartService,
  ) { }

  ngOnInit(): void {
    this.loadFacility();
  }

  isSelectedFacility(facilityId: string): boolean {
    const selectedId = this.facilityCartService.getMetadata().facilityId;
    return selectedId === facilityId;
  }

  loadFacility() {
    this.bs.getFacility().subscribe({
      next: (res) => {
        this.facilityList = res;
      }
    });
  }

  selectFacility(item: ResponseFacility): void {
    if (!item) return;

    const {
      facilityId,
      facilityName,
      bookingFrequency,
      price = 0,
      openingTime,
      closingTime,
      mondaySlot,
      tuesdaySlot,
      wednesdaySlot,
      thursdaySlot,
      fridaySlot,
      saturdaySlot,
      sundaySlot
    } = item;

    this.facilityCartService.cleanMetadata();

    const updatedMetadata = {
      ...this.facilityCartService.getMetadata(),
      facilityId,
      facilityName,
      bookingFrequency,
      price,
      openingTime,
      closingTime,
      mondaySlot,
      tuesdaySlot,
      wednesdaySlot,
      thursdaySlot,
      fridaySlot,
      saturdaySlot,
      sundaySlot
    };

    this.facilityCartService.updateMetadata(updatedMetadata);
  }

  openAttachment(catalogueId: string) {
    this.openAttachmentId = catalogueId;
    this.isAttachmentDialogOpen = true;
  }

  handleAttachmentClosingDialog(isClosingAction: boolean) {
    this.openAttachmentId = '';
    this.isAttachmentDialogOpen = false;
  }

  openPricing(facility: ResponseFacility) {
    this.openRecord = facility;
    this.isPricingDialogOpen = true;
  }

  handlePriceClosingDialog(isClosingAction: boolean) {
    this.openRecord = null;
    this.isPricingDialogOpen = false;
  }

  getAttachmentPath(path: string) {
    return this.bs.getAttachmentAssetPath(path);
  }

}
