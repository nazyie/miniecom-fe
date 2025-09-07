import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopDialog } from '../shop-dialog/shop-dialog';
import { ShopService } from '../../services/shop-service';
import { Shop } from '../../model/shop.model';
import { PageResponse } from '../../../common/pagination.model';
import { TableColumn } from '../../../common/table_column.model';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";
import { Table } from '../../../common/components/table/table';
import { ToastService } from '../../../common/services/toast-service';
import { ResponseText } from '../../../common/constant/response';

@Component({
  selector: 'app-shop-page',
  imports: [
    ShopDialog,
    FormsModule,
    AdminLayout,
    Table,
    ReactiveFormsModule
],
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.css'
})
export class ShopPage {
  titlePage: string = 'Kedai';
  columns: TableColumn[] = [
    { name: 'Nama Kedai', key: 'name' }
  ];

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: Shop | undefined;

  constructor(
    private shopService: ShopService,
    private toastService: ToastService
  ) { }

  @ViewChild(ShopDialog) modal!: ShopDialog;
  @ViewChild(Table) table!: Table;

  openAddShopModal() {
    this.modalFormTitle = 'Cipta Kedai';
    this.modalSubmitLabel = 'Cipta';
    this.modalFormMode = 'CREATE';
    this.modalIsOpen = true;
  }

  openEditModal(data: Shop) {
    this.modalFormTitle = 'Kemaskini Kedai';
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

  onFormSubmit({ formMode, data }: {formMode: string, data: any}) {
    switch (formMode) {
      case 'CREATE':
        this.shopService.createShop(data).subscribe({
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
        this.shopService.updateShop(data).subscribe({
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
        this.shopService.deleteShop(data).subscribe({
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

  fetchShops(page: number, size: number): Observable<PageResponse<Shop>> {
    return this.shopService.getShop(page, size);
  }
}
