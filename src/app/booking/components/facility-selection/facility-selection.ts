import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseFacility } from '../../model/booking-page.model';
import { BookingService } from '../../service/booking-service';
import { FacilityCartService } from '../../service/facility-cart-service';
import { FacilityAttachment } from "./facility-attachment/facility-attachment";

@Component({
  selector: 'app-facility-selection',
  imports: [FacilityAttachment],
  templateUrl: './facility-selection.html',
  styleUrl: './facility-selection.css'
})
export class FacilitySelection implements OnInit {
  facilityList: ResponseFacility[] | null = null;
  isAttachmentDialogOpen: boolean = false;
  openAttachmentId: string = '';

  constructor(
    private bookingService: BookingService,
    private facilityCartService: FacilityCartService,
  ) { }

  ngOnInit(): void {
    this.loadFacility();
  }

  isSelectedFacility(facilityId: string): boolean {
    const selectedId =  this.facilityCartService.cart.facilityId;
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

  handleClosingDialog(isClosingAction: boolean) {
    this.openAttachmentId = '';
    this.isAttachmentDialogOpen = false;
  }

  openAttachment(catalogueId: string) {
    this.openAttachmentId= catalogueId;
    this.isAttachmentDialogOpen = true;
  }

  getAttachmentPath(path: string) {
    return this.bookingService.getAttachmentAssetPath(path);
  }

}
