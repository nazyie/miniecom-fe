import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { FacilityDateSelection } from "./facility-date-selection/facility-date-selection";
import { FacilityConfirmation } from "../facility-confirmation/facility-confirmation";
import { ResponseShopDetail } from '../../model/booking-page.model';
import { FacilityCartService } from '../../service/facility-cart-service';
import { FacilitySelection } from './facility-selection/facility-selection';

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
    private fcs: FacilityCartService,
  ) { }

  ngOnInit(): void {
    this.currentStepper = this.fcs.getStepper;
    console.log(this.currentStepper);
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
    switch (this.currentStepper) {
      case 1:
        break;

      case 2:
        break;

      case 3:
        break;

      default:
    }

    this.currentStepper++;
    this.fcs.updateStepper(this.currentStepper);
    this.loadStepperNavigationText();
  }

  prev(): void {
    switch (this.currentStepper) {
      case 1:
        break;

      case 2:
        break;

      case 3:
        break;

      default:
    }
    this.currentStepper--;
    this.fcs.updateStepper(this.currentStepper);
    this.loadStepperNavigationText();
  }

  validToProceedNext(): boolean {
    const cart = this.fcs.getMetadata();

    switch (this.currentStepper) {
      case 1:
        return !!cart.facilityId
        break;

      case 2:
        return this.validateSecondStepBeforeNavigateNext();

      case 3:
        return false;

      default:
        return true;
    }
  }

  validToProceedPrev(): boolean {
    return this.currentStepper > 1;
  }

  private validateSecondStepBeforeNavigateNext(): boolean {
    const cart = this.fcs.getMetadata();

    switch (cart.bookingFrequency) {
      case 'DAILY_SAME_DAY':
      case 'DAILY':
        return cart.selected.length === 2;

      default:
        return cart.selected.length > 0;
    }
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
