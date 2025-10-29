import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../service/booking-service';
import { CatalogueFacilityPackage } from '../../../../catalogue/model/catalogue-modal';
import { ResponseFacility } from '../../../model/booking-page.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facility-price',
  imports: [CommonModule],
  templateUrl: './facility-price.html',
  styleUrl: './facility-price.css'
})
export class FacilityPrice implements OnInit {
  pricingPackages: CatalogueFacilityPackage[] = [];

  @Input() record!: ResponseFacility | null;

  @Output() closeDialogEvent = new EventEmitter<boolean>();

  constructor(
    private bookingService: BookingService 
  ) {}

  ngOnInit(): void {
    console.log(this.record);
    this.loadData();
  }

  closeDialog() {
    this.closeDialogEvent.emit(true);
  }

  loadData() {
    if (this.record) {
      this.bookingService.getPricingFacility(this.record.facilityId).subscribe({
        next: (response) => {
          this.pricingPackages = response;
        }
      });
    }
  }

  get frequencyUnit() : string {
    if (this.record) {
      switch(this.record.bookingFrequency) {
        case 'HOURLY':
          return 'sejam / per slot';

        case 'DAILY':
          return 'sehari / per slot';

        case 'HALF_HOURLY':
          return '30 min / per slot';
      }
    }
    return 'N/A';
  }

  getTimeSpending(totalSlot: number) : string {
    if (this.record) {
      switch(this.record.bookingFrequency) {
        case 'HOURLY':
          return `/ ${totalSlot} jam`;

        case 'DAILY':
          return `/ ${totalSlot} hari`;

        case 'HALF_HOURLY':
          return ``;
      }
    }
    return '';
  }

}
