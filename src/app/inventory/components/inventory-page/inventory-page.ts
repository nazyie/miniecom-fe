import { Component, DestroyRef, ViewChild } from '@angular/core';
import { TableColumn } from '../../../common/table_column.model';
import { Inventory } from '../../model/inventory-modal';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { ToastService } from '../../../common/services/toast-service';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { InventoryService } from '../../services/inventory-service';
import { PageResponse } from '../../../common/pagination.model';
import { AdminLayout } from '../../../common/components/admin-layout/admin-layout';
import { FormsModule } from '@angular/forms';
import { Table } from "../../../common/components/table/table";
import { InventoryDialog } from "../inventory-dialog/inventory-dialog";
import { ResponseText } from '../../../common/constant/response';

@Component({
  selector: 'app-inventory-page',
  imports: [AdminLayout, FormsModule, Table, InventoryDialog],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css'
})
export class InventoryPage {
  titlePage: string = 'Inventori';
  columns: TableColumn[] = [
    { name: 'Nama Inventori', key: 'name' },
    { name: 'Produk Dipaparkan', key: 'showInventory', transformer: 'display' },
    { name: 'Dicipta Pada', key: 'createdAt', transformer: 'date' },
    { name: 'Dikemaskini Pada', key: 'updatedAt', transformer: 'date' }
  ];

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: Inventory | undefined;

  search: string = '';
  search$ = new Subject<string>();

  @ViewChild(InventoryDialog) modal!: InventoryDialog;
  @ViewChild(Table) table!: Table;

  constructor(
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private shopNavigatorService: ShopNavigatorService,
    private inventoryService: InventoryService
  ) {
  }


  ngOnInit(): void {
    const searchChanges = this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.table.loadData());

    const showNavigatorChanges = this.shopNavigatorService.currentShop$.subscribe(item => {
      this.table.loadData();
    })


    this.destroyRef.onDestroy(() => {
      searchChanges.unsubscribe();
      showNavigatorChanges.unsubscribe();
    })
  }

  openAddModal() {
    this.modalFormTitle = 'Cipta Inventori';
    this.modalSubmitLabel = 'Cipta';
    this.modalFormMode = 'CREATE';
    this.modalIsOpen = true;
  }

  openEditModal(data: Inventory) {
    this.modalFormTitle = 'Kemaskini Inventori';
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
    const shopId = this.shopNavigatorService.shopId;

    switch (formMode) {
      case 'CREATE':
        this.inventoryService.createInventory(shopId, data).subscribe({
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
        this.inventoryService.updateInventory(shopId, data).subscribe({
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
        this.inventoryService.deleteInventory(shopId, data).subscribe({
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
        this.table.loadData();
        this.resetModal();
    }
  }

  fetchProduct(page: number, size: number): Observable<PageResponse<Inventory>> {
    return this.inventoryService.getInventory(page, size, this.shopNavigatorService.shopId, this.search);
  }
}
