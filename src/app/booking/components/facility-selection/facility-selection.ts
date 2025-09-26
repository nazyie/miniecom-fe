import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ResponseFacility } from '../../model/booking-page.model';
import { BookingService } from '../../service/booking-service';

@Component({
  selector: 'app-facility-selection',
  imports: [],
  templateUrl: './facility-selection.html',
  styleUrl: './facility-selection.css'
})
export class FacilitySelection implements OnInit {
  facilityList: ResponseFacility[] | null = null;

  @Output() selected = new EventEmitter<ResponseFacility>();

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadFacility();
  }

  loadFacility() {
    this.bookingService.getFacility().subscribe({
      next: (res) => {
        this.facilityList = res;
      }
    });
  }

  selectFacility(item: ResponseFacility) {
    this.selected.emit(item);
  }
}
