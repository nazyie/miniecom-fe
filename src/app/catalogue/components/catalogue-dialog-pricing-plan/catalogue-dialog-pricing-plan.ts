import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { debounceTime } from 'rxjs';
import { CatalogueFacilityPackage } from '../../model/catalogue-modal';
import { PackageForm } from "./package-form/package-form";
import { InventoryService } from '../../services/catalogue-service';
import { CommonModule } from '@angular/common';
import { RuleTypePipe } from '../../../common/pipe/rule-type-pipe';
import { ToastService } from '../../../common/services/toast-service';
import { ResponseText } from '../../../common/constant/response';

@Component({
  selector: 'app-catalogue-dialog-pricing-plan',
  imports: [ReactiveFormsModule, PackageForm, CommonModule, RuleTypePipe],
  templateUrl: './catalogue-dialog-pricing-plan.html',
  styleUrl: './catalogue-dialog-pricing-plan.css'
})
export class CatalogueDialogPricingPlan implements OnInit {
  form: FormGroup = new FormGroup({});
  data: CatalogueFacilityPackage[] = [];
  pricingLabel: string = 'Harga';

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: CatalogueFacilityPackage | undefined;

  constructor(
    private fb: FormBuilder,
    private cp: CataloguePageService,
    private dr: DestroyRef,
    private inventoryService: InventoryService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const facility = this.cp.catalogue?.facility;

    if (!facility) {
      this.form = this.fb.group({
        price: [0, [Validators.required]],
        enableDeposit: [0, [Validators.required]],
        depositPercentage: [0, [Validators.required]],
      });
    } else {
      const depositPercentage = facility.depositPercentage;

      this.form = this.fb.group({
        price: [facility?.price, [Validators.required]],
        enableDeposit: [depositPercentage && depositPercentage > 0 ? true : false, [Validators.required]],
        depositPercentage: [depositPercentage, [Validators.required]]
      });
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      let currData = this.cp.catalogue;

      if (currData) {
        let updatedFacility = { ...currData.facility, ...value };

        if (!this.form.get('enableDeposit')?.value) {
          updatedFacility = {
            ...updatedFacility,
            depositPercentage: 0
          }
        }

        currData.facility = updatedFacility;
        console.log(updatedFacility)
        this.cp.updateCatalogue(currData);
      }
    });


    this.loadTable();
    this.loadPricingLable();

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
    })
  }

  private loadPricingLable() {
    if (this.cp.catalogue?.facility) {
      this.pricingLabel =
        this.cp.catalogue?.facility?.bookingFrequency == 'DAILY'
          ||
          this.cp.catalogue?.facility?.bookingFrequency == 'DAILY_SAME_DAY'
          ?
          'Harga Sehari' : 'Harga Per Slot'
    }
  }

  deletePackage(packageId: string) {
    this.onFormSubmit({
      formMode: 'DELETE',
      data: packageId
    })
  }

  onFormSubmit({ formMode, data }: { formMode: string, data: any }) {
    if (this.cp.catalogue) {
      const catalogueId = this.cp.catalogue.id;

      switch (formMode) {
        case 'CREATE':
          this.inventoryService.createPackage(catalogueId, data).subscribe({
            next: () => {
              this.loadTable();
              this.resetModal();
              this.toastService.success(ResponseText.RECORD_SUCCESS_CREATE);
            },
            error: () => {
              console.log('Error');
            }
          })
          break;

        case 'UPDATE':
          this.inventoryService.updatePackage(catalogueId, data).subscribe({
            next: () => {
              this.loadTable();
              this.resetModal();
              this.toastService.info(ResponseText.RECORD_SUCCESS_UPDATE);
            },
            error: (err) => {
              console.error('Error creating shop:', err);
            }
          });
          break;

        case 'DELETE':
          this.inventoryService.deletePackage(catalogueId, data).subscribe({
            next: () => {
              this.loadTable();
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
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  openAddModal() {
    this.modalFormTitle = 'Cipta Pakej';
    this.modalSubmitLabel = 'Cipta';
    this.modalFormMode = 'CREATE';
    this.modalIsOpen = true;
  }

  openEditModal(data: CatalogueFacilityPackage) {
    this.modalFormTitle = 'Kemaskini Pakej';
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

  loadTable() {
    if (this.cp.catalogue) {
      this.inventoryService.getPackage(this.cp.catalogue.id).subscribe({
        next: (res) => {
          this.data = res;
        }
      })
    }
  }

  formatPrice() {
    const control = this.form.get('price');
    let value = control?.value;

    if (value != null && value !== '') {
      control?.setValue(parseFloat(value).toFixed(2), { emitEvent: false });
    }
  }
}
