import { Component, OnInit } from '@angular/core';
import { ResponseFacility } from '../../model/booking-page.model';
import { BookingService } from '../../service/booking-service';
import { FacilityCartService } from '../../service/facility-cart-service';

@Component({
  selector: 'app-facility-selection',
  imports: [],
  templateUrl: './facility-selection.html',
  styleUrl: './facility-selection.css'
})
export class FacilitySelection implements OnInit {
  facilityList: ResponseFacility[] | null = null;

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
      price: item.price ?? 0
    };

    const hasChanged = Object.keys(updatedCart).some(
      key => (updatedCart as any)[key] !== (currentCart as any)[key]
    );

    if (hasChanged) {
      this.facilityCartService.updateMetadata(updatedCart);
    }
  }
}
