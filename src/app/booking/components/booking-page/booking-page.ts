import { Component, numberAttribute } from '@angular/core';
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { FacilitySelection } from "../facility-selection/facility-selection";
import { FacilityDateSelection } from '../facility-date-selection/facility-date-selection';
import { FacilityConfirmation } from '../facility-confirmation/facility-confirmation';

@Component({
  selector: 'app-booking-page',
  imports: [NavigationBar, FacilitySelection, FacilityDateSelection, FacilityConfirmation],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.css'
})
export class BookingPage {
  primaryColor: string = '#570df8';
  currentStepper: number = 1;

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
