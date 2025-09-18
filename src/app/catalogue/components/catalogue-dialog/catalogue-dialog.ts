import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InventoryStockTable } from "../catalogue-variant-table/catalogue-variant-table";
import { Catalogue, CatalogueVariant } from '../../model/catalogue-modal';
import { ToastService } from '../../../common/services/toast-service';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { InventoryService } from '../../services/catalogue-service';
import { ResponseText } from '../../../common/constant/response';
import { CatalogueVariantDialog } from '../catalogue-variant-dialog/catalogue-variant-dialog';

@Component({
  selector: 'app-catalogue-dialog',
  imports: [FormsModule, ReactiveFormsModule, InventoryStockTable, CatalogueVariantDialog],
  templateUrl: './catalogue-dialog.html',
  styleUrl: './catalogue-dialog.css'
})
export class CatalogueDialog implements OnInit, AfterViewInit {
  @Input() formTitle: string = 'Cipta Catalogue';
  @Input() submitLabel: string = 'Cipta';
  @Input() formMode: string = 'CREATE';
  @Input() record: Catalogue | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  @ViewChild(InventoryStockTable) table !: InventoryStockTable;

  form: FormGroup = new FormGroup({});

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: CatalogueVariant | undefined;

  shopType: string | null = 'Miniecom';

  errorMessageForTimeValidation: string = '';

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private shopNavigatorService: ShopNavigatorService,
    private inventoryService: InventoryService,
    private destroyRef: DestroyRef
  ) {

  }
  ngAfterViewInit(): void {
    if (this.shopType === 'Miniecom')
      this.table.loadData();
  }

  ngOnInit(): void {
    this.shopType = this.shopNavigatorService.shopType;
    const catalogueType = this.shopType === 'Miniecom' ? 'INVENTORY' : 'FACILITY';

    if (this.record) {
      this.form = this.fb.group({
        id: [this.record.id, []],
        name: [this.record.name, [Validators.required]],
        catalogueType: [this.record.catalogueType, [Validators.required]],
        itemDescription: [this.record.itemDescription, []],
        publish: [this.record.publish, []],
        facility:
          this.fb.group({
            price: [this.record.facility?.price, []],
            bookingFrequency: [this.record.facility?.bookingFrequency, []],
            openingTime: [this.record.facility?.openingTime, []],
            closingTime: [this.record.facility?.closingTime, []],
            sundaySlot: [this.record.facility?.sundaySlot, []],
            mondaySlot: [this.record.facility?.mondaySlot, []],
            tuesdaySlot: [this.record.facility?.tuesdaySlot, []],
            wednesdaySlot: [this.record.facility?.wednesdaySlot, []],
            thursdaySlot: [this.record.facility?.thursdaySlot, []],
            fridaySlot: [this.record.facility?.fridaySlot, []],
            saturdaySlot: [this.record.facility?.saturdaySlot, []],
          })
      })
    } else {
      this.form = this.fb.group({
        id: [''],
        name: ['', [Validators.required]],
        catalogueType: [catalogueType, [Validators.required]],
        itemDescription: [''],
        publish: [true],
        facility: this.fb.group({
          price: [''],
          bookingFrequency: [''],
          openingTime: [''],
          closingTime: [''],
          sundaySlot: [true],
          mondaySlot: [true],
          tuesdaySlot: [true],
          wednesdaySlot: [true],
          thursdaySlot: [true],
          fridaySlot: [true],
          saturdaySlot: [true],
        })
      });
    }

    const listenOpeningTime = this.form.get('facility.closingTime')?.valueChanges.subscribe(() => {
      if (this.shopType === 'Booking Sistem' && this.form.get('facility.bookingFrequency')?.value !== 'DAILY') {
        console.log('openingTimeChanged');
        this.validateInputTime();
      }
    });

    const listenClosingTime = this.form.get('facility.openingTime')?.valueChanges.subscribe(() => {
      if (this.shopType === 'Booking Sistem' && this.form.get('facility.bookingFrequency')?.value !== 'DAILY' && this.form.get('facility.openingTime')?.value != '') {
        console.log('closingTimeChanged');
        this.validateInputTime();
      }
    });

    const listeningFrequencyFacility = this.form.get('facility.bookingFrequency')?.valueChanges.subscribe(() => {
      this.form.get('facility.openingTime')?.setValue('');
      this.form.get('facility.closingTime')?.setValue('');
      this.errorMessageForTimeValidation = '';
    })

    this.destroyRef.onDestroy(() => {
      listenClosingTime?.unsubscribe();
      listenOpeningTime?.unsubscribe();
      listeningFrequencyFacility?.unsubscribe();
    })
  }

  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as Catalogue;
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
      formMode: 'CANCEL',
      data: null
    })
  }

  openAddModal() {
    this.form.markAllAsTouched();

    if (this.formMode === 'CREATE' && this.form.controls['id'].value == '') {
      if (this.form.valid) {
        this.createInventoryAndReplaceFormMode();
        this.modalFormTitle = 'Cipta Stok';
        this.modalSubmitLabel = 'Cipta';
        this.modalFormMode = 'CREATE';
        this.modalIsOpen = true;
      }
    } else {
      this.modalFormTitle = 'Cipta Stok';
      this.modalSubmitLabel = 'Cipta';
      this.modalFormMode = 'CREATE';
      this.modalIsOpen = true;
    }
  }

  openEditModal(data: CatalogueVariant) {
    this.modalFormTitle = 'Kemaskini Stok';
    this.modalSubmitLabel = 'Kemaskini';
    this.modalFormMode = 'UPDATE';
    this.modalIsOpen = true;
    this.modalRecord = data;
  }

  resetModal() {
    this.modalIsOpen = false;
    this.modalFormTitle = '';
    this.modalSubmitLabel = '';
    this.modalFormMode = '';
    this.modalRecord = undefined;
  }

  onFormSubmit({ formMode, data }: { formMode: string, data: any }) {
    const inventoryId = this.form.controls['id'].value;

    switch (formMode) {
      case 'CREATE':
        this.inventoryService.createVariant(inventoryId, data).subscribe({
          next: () => {
            this.table.loadData();
            this.resetModal();
            this.toastService.success(ResponseText.RECORD_SUCCESS_CREATE);
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

      case 'UPDATE':
        this.inventoryService.updateVariant(inventoryId, data).subscribe({
          next: () => {
            this.table.loadData();
            this.resetModal();
            this.toastService.info(ResponseText.RECORD_SUCCESS_UPDATE);
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

      case 'DELETE':
        this.inventoryService.deleteVariant(inventoryId, data).subscribe({
          next: () => {
            this.table.loadData();
            this.resetModal();
            this.toastService.info(ResponseText.RECORD_SUCCESS_DELETE);
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

      default:
        this.resetModal();
    }
  }

  handleTableAction({ action, data }: { action: string, data: any }) {
    if (action === 'DELETE') {
      this.onFormSubmit({ formMode: action, data });
    } else {
      this.openEditModal(data);
    }
  }

  private createInventoryAndReplaceFormMode() {
    // create the record first // then replace the form mode

    const shopId = this.shopNavigatorService.shopId;
    const data = this.form.value as Catalogue;

    this.inventoryService.createInventory(shopId, data).subscribe({
      next: (response: Catalogue) => {
        this.formTitle = 'Kemaskini Katalog';
        this.submitLabel = 'Kemaskini';
        this.formMode = 'UPDATE';
        this.form.controls['id'].setValue(response.id);
      },
      error: (err) => {
        console.error('Error creating shop:', err);
      }
    });
  }

  private validateInputTime() {
    if (!this.validateCatalogueFrequencyByStartTimeAndEndTime(
      this.form.get('facility.openingTime')?.value,
      this.form.get('facility.closingTime')?.value,
      this.form.get('facility.bookingFrequency')?.value
    )) {
      this.errorMessageForTimeValidation = 'Waktu operasi mula dan tamat tidak tepat dengan frekuensi fasiliti'
    } else {
      this.errorMessageForTimeValidation = ''
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
