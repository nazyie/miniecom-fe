import { Component, OnInit } from '@angular/core';
import { DatePicker } from "../../../common/components/date-picker/date-picker";
import { FacilityCartService } from '../../service/facility-cart-service';
import { BookingService } from '../../service/booking-service';
import { RequestBookedFacility, ResponseBookedFacility } from '../../model/booking-page.model';
import { DateTimeSlotPicker } from "../date-time-slot-picker/date-time-slot-picker";

@Component({
  selector: 'app-facility-date-selection',
  imports: [DatePicker, DateTimeSlotPicker],
  templateUrl: './facility-date-selection.html',
  styleUrl: './facility-date-selection.css'
})
export class FacilityDateSelection implements OnInit {
  cache = new Map<string, ResponseBookedFacility[]>();

  constructor(
    private facilityCartService: FacilityCartService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {}

  get isBookingFrequencyDateRange(): boolean {
    return this.facilityCartService.cart.bookingFrequency === 'DAILY';
  }

  get selectedDate(): string[] {
    return this.facilityCartService.cart.selected;
  }

  handleSelectedDate(selected: string[]): void {
    const cart = this.facilityCartService.cart;
    cart.selected = selected;
    if (selected.length === 2) {
      cart.noOfSlot = this.calculateDays(selected[0], selected[1]);
    }
    this.facilityCartService.updateMetadata(cart);
  }

  handleMonthChanges({ year, month }: { year: number; month: number }): void {
    this.loadDisabledDates(year, month);
  }

  loadDisabledDates(year: number, month: number): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let i = 0; i < 3; i++) {
      const targetMonthIndex = (month - 1 + i) % 12;
      const targetYear = year + Math.floor((month - 1 + i) / 12);

      if (
        targetYear < currentYear ||
        (targetYear === currentYear && targetMonthIndex < currentMonth)
      ) continue;

      const from = new Date(targetYear, targetMonthIndex, 1);
      const to = new Date(targetYear, targetMonthIndex + 1, 0);
      const cacheKey = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, '0')}`;

      if (this.cache.has(cacheKey)) continue;

      const payload: RequestBookedFacility = {
        sessionId: this.facilityCartService.cart.sessionId,
        startDate: this.formatDateLocal(from),
        endDate: this.formatDateLocal(to)
      };

      this.bookingService.getBookedFacility(payload).subscribe({
        next: response => this.cache.set(cacheKey, response)
      });
    }
  }

  private formatDateLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays > 0 ? diffInDays - 1 : 0;
  }

  get disabledDates(): string[] {
    return Array.from(this.cache.values()).flatMap(f => f.map(x => x.date));
  }
}