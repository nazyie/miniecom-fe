import { Component } from '@angular/core';
import { RequestBookedFacility, ResponseBookedFacility } from '../../../../model/booking-page.model';
import { FacilityCartService } from '../../../../service/facility-cart-service';
import { BookingService } from '../../../../service/booking-service';
import { DatePicker } from "../../../../../common/components/date-picker/date-picker";

@Component({
  selector: 'app-date-time-picker',
  imports: [DatePicker],
  templateUrl: './date-time-picker.html',
  styleUrl: './date-time-picker.css'
})
export class DateTimePicker {
  cache = new Map<string, ResponseBookedFacility[]>();

  constructor(
    private fcs: FacilityCartService,
    private bs: BookingService
  ) {}

  handleSelectedDate(selected: string[]): void {
    const cart = this.fcs.getMetadata();
    cart.selected = selected;
    if (selected.length === 2) {
      cart.noOfSlot = this.calculateDays(selected[0], selected[1], cart.bookingFrequency);
    }
    this.fcs.updateMetadata(cart);
  }

  handleMonthChanges({ year, month }: { year: number; month: number }): void {
    this.loadDisabledDates(year, month);
  }

  get selectedDate(): string[] {
    return this.fcs.getMetadata().selected;
  }

  get disableSameDatePick(): boolean {
    return this.fcs.getMetadata().bookingFrequency === 'DAILY_SAME_DAY' ?
      false : true;
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
        sessionId: this.fcs.getMetadata().sessionId,
        startDate: this.formatDateLocal(from),
        endDate: this.formatDateLocal(to)
      };

      this.bs.getBookedFacility(payload).subscribe({
        next: response => this.cache.set(cacheKey, response)
      });
    }
  }

  private calculateDays(startDate: string, endDate: string, bookingFrequency: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Normalize time to midnight to avoid partial day errors
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  switch (bookingFrequency) {
    case 'DAILY':
      // Include both start and end day
      return diffInDays + 1;

    case 'DAILY_SAME_DAY':
      // If same day, count as 1
      return diffInDays === 0 ? 1 : diffInDays + 1;

    default:
      // Default behavior (exclusive end day)
      return diffInDays > 0 ? diffInDays - 1 : 0;
  }
}


  get disabledDates(): string[] {
    return Array.from(this.cache.values()).flatMap(f => f.map(x => x.date));
  }

  private formatDateLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
