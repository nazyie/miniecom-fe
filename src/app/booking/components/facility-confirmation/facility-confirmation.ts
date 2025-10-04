import { Component, OnInit } from '@angular/core';
import { FacilityCartService } from '../../service/facility-cart-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../service/booking-service';
import { RequestBookingFacility } from '../../model/booking-page.model';
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly facilityCartService: FacilityCartService,
    private readonly bookingService: BookingService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBookingDetail();
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
    const { facilityName, selected, price, noOfSlot } = this.facilityCartService.cart;

    this.facilityName = facilityName ?? '';
    this.startTime = selected?.[0] ?? '';
    this.endTime = selected?.[selected.length - 1] ?? '';
    this.totalPrice = (price ?? 0) * (noOfSlot ?? 0);
  }

  confirmBooking(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please complete all required fields.');
      return;
    }

    const cart = this.facilityCartService.cart;

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
