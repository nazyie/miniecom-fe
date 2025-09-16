import { Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { InventoryStock } from '../../model/inventory-modal';

@Component({
  selector: 'app-inventory-stock-dialog',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-stock-dialog.html',
  styleUrl: './inventory-stock-dialog.css'
})
export class InventoryStockDialog implements OnInit {
  @Input() formTitle: string = 'Cipta Inventory Stok';
  @Input() submitLabel: string = 'Cipta';
  @Input() formMode: string = 'CREATE';
  @Input() record: InventoryStock | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private destroyRef: DestroyRef
  ) {
  }

  ngOnInit(): void {
    if (this.record) {
      const enableStockChecking = this.record.stockCount >= 0 ?
        true : false;

      this.form = this.fb.group({
        id: [this.record.id, [Validators.required]],
        variantName: [this.record.variantName, [Validators.required]],
        variantCode: [this.record.variantCode, []],
        stockCount: [enableStockChecking ? this.record.stockCount : 0, []],
        enableStockChecking: [enableStockChecking, []]
      });

      if (enableStockChecking) {
        this.form.get('stockCount')?.enable();
      } else {
        this.form.get('stockCount')?.disable();
      }
    } else {
      this.form = this.fb.group({
        variantName: ['', [Validators.required]],
        variantCode: ['', []],
        stockCount: ['0', []],
        enableStockChecking: [true, []]
      });
    }

    const detectStockChange = this.form.get('enableStockChecking')?.valueChanges.subscribe((checked: boolean) => {
      const stockControl = this.form.get('stockCount')

      if (checked) {
        stockControl?.enable();
      } else {
        stockControl?.disable();
      }
    });

    this.destroyRef.onDestroy(() => {
      detectStockChange?.unsubscribe();
    });
  }


  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      let formRequest = this.form.value as InventoryStock;
      if (this.form.controls['enableStockChecking'].value !== true) {
        formRequest.stockCount = -1;
      }

      this.formSubmitted.emit({
          formMode: this.formMode,
          data: formRequest
      });
    } else {
      console.log('Form not valid');
      console.log(this.form.controls);
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
}
