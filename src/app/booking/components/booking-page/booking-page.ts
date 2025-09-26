import { Component } from '@angular/core';
import { SearchByFacility } from '../search-by-facility/search-by-facility';
import { BookingService } from '../../service/booking-service';
import { Title } from '@angular/platform-browser';
import { ResponseShopDetail } from '../../model/booking-page.model';
import { NotFound } from "../not-found/not-found";

@Component({
  selector: 'app-booking-page',
  imports: [SearchByFacility, NotFound],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.css'
})
export class BookingPage {
  shopDetail: ResponseShopDetail | null = null;

  constructor(
    private bookingService: BookingService,
    private title: Title
  ) {
    if (this.shopDetail == null) {
      this.bookingService.getShopDetail().subscribe({
        next: (response) => {
          this.shopDetail = response;
          title.setTitle(this.shopDetail.shopName);
        },
        error: () => {
          title.setTitle('Booking Website');
        }
      });
    }
  }

  toggleOption: boolean = true;

  handleToggleOption(toggleOption: boolean) {
    this.toggleOption = toggleOption;
  }

}
