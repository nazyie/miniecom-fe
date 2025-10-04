import { Injectable } from '@angular/core';
import { BookingMetadata, newBookingMetadata } from '../model/booking.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilityCartService {
  static readonly FACILITY_METADATA = 'FACILITY_METADATA'

  cart!: BookingMetadata;

  constructor() {
    this.loadOrCreateFacilityMetadata();
  }

  getMetadata() : BookingMetadata {
    return this.cart;
  }

  updateMetadata(cart: BookingMetadata) {
    this.cart = cart;

    sessionStorage.setItem(FacilityCartService.FACILITY_METADATA,
      JSON.stringify(this.cart)
    );
  }

  confirmPurchase() {
    this.removeFacilityMetadata();
  }

  private loadOrCreateFacilityMetadata() {
    const facilityMetadata = sessionStorage.getItem(FacilityCartService.FACILITY_METADATA);

    if (facilityMetadata) {
      this.cart = JSON.parse(facilityMetadata);
    } else {
      this.cart = newBookingMetadata();
    }
  }

  private removeFacilityMetadata() {
    this.cart = newBookingMetadata();
    sessionStorage.removeItem(FacilityCartService.FACILITY_METADATA);
  }
}
