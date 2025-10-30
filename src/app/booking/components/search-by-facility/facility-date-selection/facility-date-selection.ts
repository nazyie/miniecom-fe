import { Component, OnInit } from '@angular/core';
import { FacilityCartService } from '../../../service/facility-cart-service';
import { DateTimeSlotPicker } from './date-time-slot-picker/date-time-slot-picker';
import { DateTimePicker } from "./date-time-picker/date-time-picker";

@Component({
  selector: 'app-facility-date-selection',
  imports: [DateTimeSlotPicker, DateTimePicker],
  templateUrl: './facility-date-selection.html',
  styleUrl: './facility-date-selection.css'
})
export class FacilityDateSelection implements OnInit {

  constructor(
    private fcs: FacilityCartService,
  ) {}

  ngOnInit(): void {}

  get metadata(): string {
    return this.fcs.getMetadata().bookingFrequency;
  }


}
