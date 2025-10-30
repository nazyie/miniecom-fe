import { Component, OnInit } from '@angular/core';
import { FacilityCartService } from '../../service/facility-cart-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../service/booking-service';
import { RequestBookingFacility, RequestTemporaryBooking } from '../../model/booking-page.model';
import { ToastService } from '../../../common/services/toast-service';

@Component({
  selector: 'app-facility-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './facility-confirmation.html',
  styleUrls: ['./facility-confirmation.css']
})
export class FacilityConfirmation implements OnInit {
  form!: FormGroup;
  facilityName = '';
  startTime = '';
  endTime = '';
  totalPrice = 0;
  totalSlot = 0;
  details: any [] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly fcb: FacilityCartService,
    private readonly bookingService: BookingService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBookingDetail();
  }

  get getBookingDetail(): string {
    const { bookingFrequency } = this.fcb.getMetadata();

    if (bookingFrequency === 'DAILY' || bookingFrequency === 'DAILY_SAME_DAY')
      return this.details.join(' - ');

    const timeRangeDetail: string[] = [];

    this.details.forEach(item => {
      timeRangeDetail.push(`${item.startTime} - ${item.endTime}`)
    })

    return timeRangeDetail.join(' | ')
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required]],
      paymentMethod: ['', Validators.required]
    });
  }

  private loadBookingDetail(): void {
    const { facilityName, selected, price, noOfSlot, bookingFrequency, openingTime, closingTime } = this.fcb.getMetadata();

    switch (bookingFrequency) {
      case 'DAILY_SAME_DAY':
      case 'DAILY':
        this.facilityName = facilityName ?? '';
        this.startTime = openingTime;
        this.endTime = closingTime;
        this.totalPrice = (price ?? 0) * (noOfSlot ?? 0);
        this.totalSlot = noOfSlot;
        this.details = selected;
        break;

      default:
        const sortedSelected = selected.sort((a, b) => a.startTime.localeCompare(b.startTime));

        this.facilityName = facilityName ?? '';
        this.startTime = sortedSelected?.[0].startTime ?? '';
        this.endTime = selected?.[selected.length - 1].endTime ?? '';
        this.totalPrice = (price ?? 0) * (noOfSlot ?? 0);
        this.totalSlot = noOfSlot;
        this.details = selected;
        break;
    }
  }

  private createTemporaryBooking(): void {
    const cart = this.fcb.getMetadata();
    const payload: RequestTemporaryBooking = {
      sessionId: cart.sessionId,
      facilityId: cart.facilityId,
      bookingDate: this.fcb.createBookingDatePayload()
    };

    this.bookingService.createTemporaryBooking(payload).subscribe({
      next: () => {
        this.toastService.info('Sila lengkapkan booking anda dalam masa 5 minit');
      },
      error: (res) => this.toastService.error(res)
    });
  }

  confirmBooking(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please complete all required fields.');
      return;
    }

    const cart = this.fcb.getMetadata();

    const payload: RequestBookingFacility = {
      sessionId: cart.sessionId,
      ...this.form.value
    };

    this.bookingService.confirmBooking(payload).subscribe({
      next: () => {
        this.toastService.success('Your order has been placed. Kindly check the invoice in your email.');
      },
      error: () => {
        this.toastService.error('Failed to confirm booking. Please try again later.');
      }
    });
  }
}
