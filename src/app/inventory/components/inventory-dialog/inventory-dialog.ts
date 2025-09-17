import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InventoryStockTable } from "../inventory-stock-table/inventory-stock-table";
import { InventoryStockDialog } from "../inventory-stock-dialog/inventory-stock-dialog";
import { Inventory, InventoryStock } from '../../model/inventory-modal';
import { ToastService } from '../../../common/services/toast-service';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { InventoryService } from '../../services/inventory-service';
import { ResponseText } from '../../../common/constant/response';

@Component({
  selector: 'app-inventory-dialog',
  imports: [FormsModule, ReactiveFormsModule, InventoryStockTable, InventoryStockDialog],
  templateUrl: './inventory-dialog.html',
  styleUrl: './inventory-dialog.css'
})
export class InventoryDialog implements OnInit, AfterViewInit {
  @Input() formTitle: string = 'Cipta Inventory';
  @Input() submitLabel: string = 'Cipta';
  @Input() formMode: string = 'CREATE';
  @Input() record: Inventory | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  @ViewChild(InventoryStockTable) table !:InventoryStockTable;

  form: FormGroup = new FormGroup({});

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: InventoryStock | undefined;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private shopNavigatorService: ShopNavigatorService,
    private inventoryService: InventoryService
  ) {

  }
  ngAfterViewInit(): void {
    this.table.loadData();
  }

  ngOnInit(): void {
    if (this.record) {
      this.form = this.fb.group({
        id: [this.record.id, []],
        name: [this.record.name, [Validators.required]],
        showInventory: [this.record.showInventory, []],
        itemDescription: [this.record.itemDescription, []],
      })
    } else {
      this.form = this.fb.group({
        id: ['', []],
        name: ['', [Validators.required]],
        showInventory: [true, []],
        itemDescription: ['', []],
      })
    }
  }

  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as Inventory;
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

  openEditModal(data: InventoryStock) {
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

  handleTableAction({action, data}: {action: string, data: any}) {
    if (action === 'DELETE') {
      this.onFormSubmit({formMode: action, data});
    } else {
      this.openEditModal(data);
    }
  }

  private createInventoryAndReplaceFormMode() {
    // create the record first // then replace the form mode

    const shopId = this.shopNavigatorService.shopId;
    const data = this.form.value as Inventory;

    this.inventoryService.createInventory(shopId, data).subscribe({
      next: (response: Inventory) => {
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

}
