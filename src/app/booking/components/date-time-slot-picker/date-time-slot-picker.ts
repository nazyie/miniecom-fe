import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilityCartService } from '../../service/facility-cart-service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { ToastService } from '../../../common/services/toast-service';
import { BookingService } from '../../service/booking-service';
import { BookedFacility, RequestBookedFacility, ResponseBookedFacility } from '../../model/booking-page.model';

@Component({
  selector: 'app-date-time-slot-picker',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './date-time-slot-picker.html',
  styleUrl: './date-time-slot-picker.css'
})
export class DateTimeSlotPicker implements OnInit {
  slots: BookedFacility[] | null = [];
  form!: FormGroup;

  constructor(
    private facilityCartService: FacilityCartService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ selectedDate: [''] });

    const dateControl = this.form.get('selectedDate');

    const listenForDateChanges = dateControl?.valueChanges.subscribe(() => {
      this.slots = null;
    });

    const listenForValidDateChanges = dateControl?.valueChanges.pipe(
      filter(date => !!date),
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        dateControl?.setValue(null);
        dateControl?.markAsUntouched();
        this.toastService.error('Invalid date');
        this.slots = [];
        return;
      }

      const payload: RequestBookedFacility = {
        sessionId: this.facilityCartService.cart.sessionId,
        startDate: date,
        endDate: date
      };

      this.bookingService.getBookedFacility(payload).subscribe({
        next: res => {
          this.slots = this.constructSlotTimer(date);

          for (const booking of res) {
            const slot = this.slots.find(s => s.startTime === booking.startTime);
            if (slot) {
              slot.lockSlot = true;
              slot.isBookingConfirm = booking.isBookingConfirm;
            }
          }
        },
        error: () => {
          this.toastService.error('Failed to load booked slots.');
          this.slots = [];
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      listenForDateChanges?.unsubscribe();
      listenForValidDateChanges?.unsubscribe();
    });
  }

  selectSlot(slot: BookedFacility): void {

  }

  private constructSlotTimer(date: string): BookedFacility[] {
    const { openingTime, closingTime, bookingFrequency } = this.facilityCartService.cart;
    const slots: BookedFacility[] = [];
    const increment = bookingFrequency === 'HOURLY' ? 60 : 30;

    const start = this.parseTime(openingTime);
    const end = this.parseTime(closingTime);

    for (let current = new Date(start); current < end; current = this.addMinutes(current, increment)) {
      const next = this.addMinutes(current, increment);
      if (next > end) break;

      slots.push({
        isBookingConfirm: false,
        lockSlot: false,
        date,
        startTime: this.formatTime(current),
        endTime: this.formatTime(next)
      });
    }

    return slots;
  }

  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
}
