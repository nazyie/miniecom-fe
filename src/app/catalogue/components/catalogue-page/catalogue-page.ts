import { Component, DestroyRef, ViewChild } from '@angular/core';
import { TableColumn } from '../../../common/table_column.model';
import { Catalogue } from '../../model/catalogue-modal';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { ToastService } from '../../../common/services/toast-service';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { InventoryService } from '../../services/catalogue-service';
import { PageResponse } from '../../../common/pagination.model';
import { AdminLayout } from '../../../common/components/admin-layout/admin-layout';
import { FormsModule } from '@angular/forms';
import { Table } from "../../../common/components/table/table";
import { ResponseText } from '../../../common/constant/response';
import { CatalogueDialog } from '../catalogue-dialog/catalogue-dialog';
import { CataloguePageService } from '../../services/catalogue-page-service';

@Component({
  selector: 'app-catalogue-page',
  imports: [AdminLayout, FormsModule, Table, CatalogueDialog],
  templateUrl: './catalogue-page.html',
  styleUrl: './catalogue-page.css'
})
export class InventoryPage {
  titlePage: string = 'Katalog';
  columns: TableColumn[] = [
    { name: 'Nama Katalog', key: 'name' },
    { name: 'Paparan', key: 'publish', transformer: 'display' },
    { name: 'Dicipta Pada', key: 'createdAt', transformer: 'date' },
    { name: 'Dikemaskini Pada', key: 'updatedAt', transformer: 'date' }
  ];

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: Catalogue | undefined;

  search: string = '';
  search$ = new Subject<string>();

  @ViewChild(CatalogueDialog) modal!: CatalogueDialog;
  @ViewChild(Table) table!: Table;

  shopNavigatorService!: ShopNavigatorService;

  constructor(
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    shopNavigatorService: ShopNavigatorService,
    private inventoryService: InventoryService,
    private cataloguePageService: CataloguePageService
  ) {
    this.shopNavigatorService = shopNavigatorService;
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
    this.modalFormTitle = 'Cipta Katalog';
    this.modalSubmitLabel = 'Simpan';
    this.modalFormMode = 'CREATE';
    this.modalIsOpen = true;
  }

  openEditModal(data: Catalogue) {
    this.modalFormTitle = 'Kemaskini Katalog';
    this.modalSubmitLabel = 'Simpan';
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
          next: (res) => {
            this.table.loadData();
            this.toastService.success(ResponseText.RECORD_SUCCESS_CREATE);
            this.cataloguePageService.updateCatalogue(res);
            this.openEditModal(res);
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
            this.toastService.info(ResponseText.RECORD_SUCCESS_DELETE);
            this.resetModal();
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

  fetchProduct(page: number, size: number): Observable<PageResponse<Catalogue>> {
    return this.inventoryService.getInventory(page, size, this.shopNavigatorService.shopId, this.search);
  }
}
