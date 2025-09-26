import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { FacilitySelection } from "../facility-selection/facility-selection";
import { FacilityDateSelection } from "../facility-date-selection/facility-date-selection";
import { FacilityConfirmation } from "../facility-confirmation/facility-confirmation";
import { BookingService } from '../../service/booking-service';

@Component({
  selector: 'app-search-by-facility',
  imports: [NavigationBar, FacilitySelection, FacilityDateSelection, FacilityConfirmation],
  templateUrl: './search-by-facility.html',
  styleUrl: './search-by-facility.css'
})
export class SearchByFacility implements OnInit{
  @Input() toggleOption!: boolean;

  @Output() toggleEvent = new EventEmitter<boolean>();

  primaryColor: string = '#570df8';
  currentStepper: number = 1;

  constructor(
  ) {}

  ngOnInit(): void {
  }

  switchOption(event: Event) {
    const input = event.target as HTMLInputElement;
    this.toggleOption = input.checked;
    this.toggleEvent.emit(this.toggleOption);
  }

  setOption(option: boolean) {
    this.toggleOption = option;
    console.log("Selected option:", this.toggleOption ? "Fasiliti" : "Tarikh");
    this.toggleEvent.emit(this.toggleOption);
  }

  next() {
    ++this.currentStepper;
  }

  isValidToProceedNext() : boolean {
    if (this.currentStepper == 3)
      return false;

    return true;
  }

  prev() {
    --this.currentStepper;
  }

  isValidToProceedPrev(): boolean {
    if (this.currentStepper == 1)
      return false;

    return true;
  }

}
