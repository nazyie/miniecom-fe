import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { debounceTime } from 'rxjs';
import { CatalogueFacilityPackage } from '../../model/catalogue-modal';
import { PackageForm } from "./package-form/package-form";

@Component({
  selector: 'app-catalogue-dialog-pricing-plan',
  imports: [ReactiveFormsModule, PackageForm],
  templateUrl: './catalogue-dialog-pricing-plan.html',
  styleUrl: './catalogue-dialog-pricing-plan.css'
})
export class CatalogueDialogPricingPlan implements OnInit {
  form: FormGroup = new FormGroup({});

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: CatalogueFacilityPackage | undefined;

  constructor(
    private fb: FormBuilder,
    private cp: CataloguePageService,
    private dr: DestroyRef
  ) { }

  ngOnInit(): void {
    if (!this.cp.catalogue) {
      this.form = this.fb.group({
        price: [0, [Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        price: [this.cp.catalogue.facility?.price, [Validators.required]]
      });
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.cp.catalogue;

      if (currData) {
        const updatedFacility = { ...currData.facility, ...value };

        currData.facility = updatedFacility;
        this.cp.updateCatalogue(currData);
      }
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
    })
  }

  onFormSubmit({ formMode, data }: {formMode: string, data: any}) {
    switch (formMode) {
      case 'CREATE':
        // this.shopService.createShop(data).subscribe({
        //   next: () => {
        //     this.table.loadData();
        //     this.resetModal();
        //     this.toastService.success(ResponseText.RECORD_SUCCESS_CREATE);
        //   },
        //   error: (err) => {
        //     console.error('Error creating shop:', err);
        //   }
        // });
        break;

      case 'UPDATE':
        // this.shopService.updateShop(data).subscribe({
        //   next: () => {
        //     this.table.loadData();
        //     this.resetModal();
        //     this.toastService.info(ResponseText.RECORD_SUCCESS_UPDATE);
        //   },
        //   error: (err) => {
        //     console.error('Error creating shop:', err);
        //   }
        // });
        break;

      case 'DELETE':
        // this.shopService.deleteShop(data).subscribe({
        //   next: () => {
        //     this.table.loadData();
        //     this.resetModal();
        //     this.toastService.info(ResponseText.RECORD_SUCCESS_DELETE);
        //   },
        //   error: (err) => {
        //     console.error('Error creating shop:', err);
        //   }
        // });
        break;

      default:
        this.resetModal();
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

  formatPrice() {
    const control = this.form.get('price');
    let value = control?.value;

    if (value != null && value !== '') {
      control?.setValue(parseFloat(value).toFixed(2), { emitEvent: false });
    }
  }
}
