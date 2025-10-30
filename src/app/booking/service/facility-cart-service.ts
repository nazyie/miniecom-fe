import { Injectable } from '@angular/core';
import { BookingMetadata, newBookingMetadata } from '../model/booking.model';
import { RequestTemporaryBookingDate } from '../model/booking-page.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityCartService {
  static readonly FACILITY_METADATA = 'FACILITY_METADATA'

  private cart!: BookingMetadata;

  constructor() {
    this.loadOrCreateFacilityMetadata();
  }

  getMetadata(): BookingMetadata {
    return this.cart;
  }

  cleanMetadata(): void {
    this.removeFacilityMetadata();
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

  createBookingDatePayload(): RequestTemporaryBookingDate[] {
    const cart = this.cart;
    const { selected } = cart;

    let payload: RequestTemporaryBookingDate[] = [];

    switch (cart.bookingFrequency) {
      case 'DAILY_SAME_DAY':
      case 'DAILY':
        if (selected.length < 2) return [];

        const startDate = new Date(selected[0]);
        const endDate = new Date(selected[1]);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          payload.push({ date, startTime: '', endTime: '' });
        }
        return payload;

      default:
        if (selected.length == 0) return [];

        const date = cart.date;
        for (let i = 0; i < selected.length; i++) {
          if (date) {
            payload.push({ date, startTime: selected[i].startTime, endTime: selected[i].endTime })
          }
        }
        return payload;
    }

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
