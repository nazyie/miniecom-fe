import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogueFacilityPackage } from '../../../model/catalogue-modal';

@Component({
  selector: 'app-package-form',
  imports: [ReactiveFormsModule],
  templateUrl: './package-form.html',
  styleUrl: './package-form.css'
})
export class PackageForm implements OnInit{
  @Input() formTitle : string = 'Kemaskini Pakej';
  @Input() submitLabel!: string;
  @Input() formMode!: string;
  @Input() record: CatalogueFacilityPackage | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  form : FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.record) {
      this.form = this.fb.group({
        id: [this.record.id, [Validators.required]],
        catalogueId: [this.record.catalogueId, [Validators.required]],
        packageName: [this.record.packageName, []],
        ruleType: [this.record.ruleType, [Validators.required]],
        threshold: [this.record.threshold, [Validators.required]],
        pricePerSlot: [this.record.pricePerSlot, [Validators.required]],
        totalPrice: [this.record.totalPrice, [Validators.required]],
      })

    } else {
      this.form = this.fb.group({
        id: ['', [Validators.required]],
        catalogueId: ['', [Validators.required]],
        packageName: ['', []],
        ruleType: ['', [Validators.required]],
        threshold: ['', [Validators.required]],
        pricePerSlot: ['', [Validators.required]],
        totalPrice: ['', [Validators.required]],
      })
    }
  }

  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as CatalogueFacilityPackage;

      this.formSubmitted.emit({
        formMode: this.formMode,
        data: formRequest
      });
    } else {
      console.log('Form not valid');
    }
  }

  delete() {
    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: this.form.controls['id'].value
    });
  }

  close() {
    this.formSubmitted.emit({
      formMode: 'cancel',
      data: null
    })
  }

  formatPrice() {
    const control = this.form.get('pricePerSlot');
    let value = control?.value;

    if (value != null && value !== '') {
      control?.setValue(parseFloat(value).toFixed(2), { emitEvent: false });
    }
  }


}
