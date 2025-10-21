import { Component, DestroyRef, OnInit } from '@angular/core';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { Catalogue } from '../../model/catalogue-modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-catalogue-dialog-time',
  imports: [ReactiveFormsModule],
  templateUrl: './catalogue-dialog-time.html',
  styleUrl: './catalogue-dialog-time.css'
})
export class CatalogueDialogTime implements OnInit {
  form: FormGroup = new FormGroup({});

  errMessageTime: string = '';

  constructor(
    private cp: CataloguePageService,
    private fb: FormBuilder,
    private dr: DestroyRef
  ) { }

  ngOnInit(): void {
    if (!this.cp.catalogue) {
      this.form = this.fb.group({
        bookingFrequency: ['', [Validators.required]],
        openingTime: ['', [Validators.required]],
        closingTime: ['', [Validators.required]],
        price: [0, [Validators.required, Validators.min(0)]],
        sundaySlot: [false],
        mondaySlot: [false],
        tuesdaySlot: [false],
        wednesdaySlot: [false],
        thursdaySlot: [false],
        fridaySlot: [false],
        saturdaySlot: [false],
      });
    } else {
      this.form = this.fb.group({
        bookingFrequency: [this.cp.catalogue.facility?.bookingFrequency, [Validators.required]],
        openingTime: [this.cp.catalogue.facility?.openingTime, [Validators.required]],
        closingTime: [this.cp.catalogue.facility?.closingTime, [Validators.required]],
        price: [this.cp.catalogue.facility?.price, [Validators.required, Validators.min(0)]],
        sundaySlot: [this.cp.catalogue.facility?.sundaySlot],
        mondaySlot: [this.cp.catalogue.facility?.mondaySlot],
        tuesdaySlot: [this.cp.catalogue.facility?.tuesdaySlot],
        wednesdaySlot: [this.cp.catalogue.facility?.wednesdaySlot],
        thursdaySlot: [this.cp.catalogue.facility?.thursdaySlot],
        fridaySlot: [this.cp.catalogue.facility?.fridaySlot],
        saturdaySlot: [this.cp.catalogue.facility?.saturdaySlot],
      });
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.cp.catalogue;
      const updatedData = { ...currData, ...value };

      this.cp.updateCatalogue(updatedData);
    });

    const listenOpeningTime = this.form.get('facility.closingTime')?.valueChanges.subscribe(() => {
      if (this.form.get('bookingFrequency')?.value !== 'DAILY') {
        this.validateInputTime();
      }
    });

    const listenClosingTime = this.form.get('facility.openingTime')?.valueChanges.subscribe(() => {
      if (this.form.get('bookingFrequency')?.value !== 'DAILY' && this.form.get('facility.openingTime')?.value != '') {
        this.validateInputTime();
      }
    });

    const listeningFrequencyFacility = this.form.get('facility.bookingFrequency')?.valueChanges.subscribe(() => {
      this.form.get('facility.openingTime')?.setValue('');
      this.form.get('facility.closingTime')?.setValue('');
      this.errMessageTime = '';
    })

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
      listenClosingTime?.unsubscribe();
      listenOpeningTime?.unsubscribe();
      listeningFrequencyFacility?.unsubscribe();
    })
  }

  get catalogue(): Catalogue | null {
    return this.cp.catalogue;
  }

  private validateInputTime() {
    if (!this.validateCatalogueFrequencyByStartTimeAndEndTime(
      this.form.get('facility.openingTime')?.value,
      this.form.get('facility.closingTime')?.value,
      this.form.get('facility.bookingFrequency')?.value
    )) {
      this.errMessageTime = 'Waktu operasi mula dan tamat tidak tepat dengan frekuensi fasiliti'
    } else {
      this.errMessageTime = ''
    }
  }

  private validateCatalogueFrequencyByStartTimeAndEndTime(openingTime: string, closingTime: string, bookingFrequency: "HOURLY" | "HALF_HOURLY"): boolean {
    const parseTime = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(openingTime);
    const endMinutes = parseTime(closingTime);

    if (endMinutes <= startMinutes) {
      return false; // invalid range
    }

    const duration = endMinutes - startMinutes;

    switch (bookingFrequency) {
      case "HOURLY":
        return duration % 60 === 0;

      case "HALF_HOURLY":
        return duration % 30 === 0;

      default:
        return false;
    }
  }

  formatPrice() {
    const control = this.form.get('facility.price');
    let value = control?.value;

    if (value != null && value !== '') {
      control?.setValue(parseFloat(value).toFixed(2), { emitEvent: false });
    }
  }

}
