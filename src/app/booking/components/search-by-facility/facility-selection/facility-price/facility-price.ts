import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueFacilityPackage } from '../../../../../catalogue/model/catalogue-modal';
import { ResponseFacility } from '../../../../model/booking-page.model';
import { BookingService } from '../../../../service/booking-service';

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
  ) { }

  ngOnInit(): void {
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

  get closingDay(): string {
    let closingDay = '** kecuali ';
    const closedDays: string[] = [];

    if (!this.record?.sundaySlot) closedDays.push('ahad');
    if (!this.record?.mondaySlot) closedDays.push('isnin');
    if (!this.record?.tuesdaySlot) closedDays.push('selasa');
    if (!this.record?.wednesdaySlot) closedDays.push('rabu');
    if (!this.record?.thursdaySlot) closedDays.push('khamis');
    if (!this.record?.fridaySlot) closedDays.push('jumaat');
    if (!this.record?.saturdaySlot) closedDays.push('sabtu');

    if (closedDays.length === 0) return '';

    return closingDay + closedDays.join(', ');
  }


  get frequencyUnit(): string {
    if (this.record) {
      switch (this.record.bookingFrequency) {
        case 'HOURLY':
          return 'sejam / per slot';

        case 'DAILY_SAME_DAY':
        case 'DAILY':
          return 'sehari / per slot';

        case 'HALF_HOURLY':
          return '30 min / per slot';
      }
    }
    return 'N/A';
  }

  getTimeSpending(totalSlot: number): string {
    if (this.record) {
      switch (this.record.bookingFrequency) {
        case 'HOURLY':
          return `/ ${totalSlot} jam`;

        case 'DAILY_SAME_DAY':
        case 'DAILY':
          return `/ ${totalSlot} hari`;

        case 'HALF_HOURLY':
          return ``;
      }
    }
    return '';
  }

}
