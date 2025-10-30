import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilityCartService } from '../../../../service/facility-cart-service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { BookedFacility, RequestBookedFacility } from '../../../../model/booking-page.model';
import { ToastService } from '../../../../../common/services/toast-service';
import { BookingService } from '../../../../service/booking-service';

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
    private fcs: FacilityCartService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({ selectedDate: [''] });

    const dateControl = this.form.get('selectedDate');

    const listenForDateChanges = dateControl?.valueChanges.pipe(
      tap(() => {
        this.slots = null;
      }),
      filter(date => !!date),
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(date => {
      if (!this.checkIsOperateDay(date)) {
        this.toastService.error('Fasiliti tidak beroperasi pada hari ini', 4000)
        this.resetFormDueError();
        return;
      }

      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.toastService.error('Tempahan tarikh lampau tidak dibenarkan', 4000);
        this.resetFormDueError();
        return;
      }

      this.updateMetadataDate(date);

      const payload: RequestBookedFacility = {
        sessionId: this.fcs.getMetadata().sessionId,
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


    if (this.fcs.getMetadata().date)
      dateControl?.setValue(this.fcs.getMetadata().date);

    this.destroyRef.onDestroy(() => {
      listenForDateChanges?.unsubscribe();
    });
  }

  updateMetadataDate(date: string): void {
    let metadata = this.fcs.getMetadata();
    metadata.date = date;
    metadata.selected = [];
    metadata.noOfSlot = 0;
    this.fcs.updateMetadata(metadata);
  }

  resetSelectedSlot(): void {
    let metadata = this.fcs.getMetadata();
    metadata.selected = []
    this.fcs.updateMetadata(metadata);
  }

  resetFormDueError(): void {
    const dateControl = this.form.get('selectedDate');
    dateControl?.setValue(null);
    dateControl?.markAsUntouched();
    this.slots = [];
  }

  selectSlot(slot: BookedFacility): void {
    const metadata = this.fcs.getMetadata();

    if (!metadata.selected) {
      metadata.selected = [];
    }

    const index = metadata.selected.findIndex(
      (s: { startTime: string; endTime: string }) => s.startTime === slot.startTime
    );

    if (index !== -1) {
      metadata.noOfSlot--;
      metadata.selected.splice(index, 1);
    } else {
      metadata.noOfSlot++;
      metadata.selected.push({
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    }

    this.fcs.updateMetadata(metadata);
  }

  isSlotSelected(slotStartTime: string): boolean {
    const metadata = this.fcs.getMetadata();

    if (!metadata.selected || metadata.selected.length === 0) {
      return false;
    }

    return metadata.selected.some(slot => slot.startTime === slotStartTime);
  }

  private checkIsOperateDay(date: string): boolean {
    if (!date) return false;

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) return false; // invalid date

    const metadata = this.fcs.getMetadata();

    // Get lowercase day name (e.g., 'monday')
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    switch (dayName) {
      case 'monday':
        return !!metadata.mondaySlot;
      case 'tuesday':
        return !!metadata.tuesdaySlot;
      case 'wednesday':
        return !!metadata.wednesdaySlot;
      case 'thursday':
        return !!metadata.thursdaySlot;
      case 'friday':
        return !!metadata.fridaySlot;
      case 'saturday':
        return !!metadata.saturdaySlot;
      case 'sunday':
        return !!metadata.sundaySlot;
      default:
        return false;
    }
  }

  private constructSlotTimer(date: string): BookedFacility[] {
    const { openingTime, closingTime, bookingFrequency } = this.fcs.getMetadata();
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
