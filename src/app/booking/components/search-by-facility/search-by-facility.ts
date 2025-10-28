import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { FacilitySelection } from "../facility-selection/facility-selection";
import { FacilityDateSelection } from "../facility-date-selection/facility-date-selection";
import { FacilityConfirmation } from "../facility-confirmation/facility-confirmation";
import { RequestTemporaryBooking, RequestTemporaryBookingDate, ResponseShopDetail } from '../../model/booking-page.model';
import { FacilityCartService } from '../../service/facility-cart-service';
import { BookingService } from '../../service/booking-service';
import { ToastService } from '../../../common/services/toast-service';

@Component({
  selector: 'app-search-by-facility',
  imports: [NavigationBar, FacilitySelection, FacilityDateSelection, FacilityConfirmation],
  templateUrl: './search-by-facility.html',
  styleUrl: './search-by-facility.css'
})
export class SearchByFacility implements OnInit {
  @Input() toggleOption!: boolean;
  @Input() shopDetail: ResponseShopDetail | null = null;
  @Output() toggleEvent = new EventEmitter<boolean>();

  primaryColor = '#570df8';
  currentStepper = 1;
  stepperTextNavigation = '';

  constructor(
    private facilityCartService: FacilityCartService,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStepperNavigationText();
  }

  switchOption(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setOption(input.checked);
  }

  setOption(option: boolean): void {
    this.toggleOption = option;
    this.toggleEvent.emit(this.toggleOption);
  }

  next(): void {
    if (this.currentStepper === 2) {
      this.bookingInitiation();
      return;
    }
    this.currentStepper++;
    this.loadStepperNavigationText();
  }

  prev(): void {
    if (this.currentStepper === 3) {
      this.cancelTemporaryBooking();
      return;
    }
    this.currentStepper--;
    this.loadStepperNavigationText();
  }

  isValidToProceedNext(): boolean {
    const cart = this.facilityCartService.cart;
    if (this.currentStepper === 3) return false;
    if (this.currentStepper === 1) return !!cart.facilityId;
    if (this.currentStepper === 2 && cart.bookingFrequency === 'DAILY') {
      return cart.selected.length === 2;
    }
    return true;
  }

  isValidToProceedPrev(): boolean {
    return this.currentStepper > 1;
  }

  bookingInitiation(): void {
    const cart = this.facilityCartService.cart;
    const payload: RequestTemporaryBooking = {
      sessionId: cart.sessionId,
      facilityId: cart.facilityId,
      bookingDate: this.createBookingDatePayload()
    };

    this.bookingService.createTemporaryBooking(payload).subscribe({
      next: () => {
        this.toastService.info('Sila lengkapkan booking anda dalam masa 5 minit');
        this.currentStepper++;
        this.loadStepperNavigationText();
      },
      error: (res) => this.toastService.error(res)
    });
  }

  cancelTemporaryBooking(): void {
    const sessionId = this.facilityCartService.cart.sessionId;
    if (!sessionId) return;

    this.bookingService.cancelTemporaryBooking(sessionId).subscribe({
      next: () => {
        this.currentStepper--;
        this.loadStepperNavigationText();
      },
      error: (res) => this.toastService.error(res)
    });
  }

  createBookingDatePayload(): RequestTemporaryBookingDate[] {
    const { selected } = this.facilityCartService.cart;
    if (selected.length < 2) return [];

    const startDate = new Date(selected[0]);
    const endDate = new Date(selected[1]);
    const payload: RequestTemporaryBookingDate[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      payload.push({ date, startTime: '', endTime: '' });
    }

    return payload;
  }

  private loadStepperNavigationText(): void {
    this.stepperTextNavigation = [
      '',
      '1. Pilih jenis fasiliti',
      '2. Pilih tarikh & waktu',
      '3. Sahkan maklumat dan lengkapkan maklumat diri'
    ][this.currentStepper] || '1. Pilih jenis fasiliti';
  }
}