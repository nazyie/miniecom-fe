import { Component, DestroyRef, OnInit,  ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
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
export class ShopPage implements OnInit {
  titlePage: string = 'Kedai';
  columns: TableColumn[] = [
    { name: 'Nama Kedai', key: 'name' },
    { name: 'Shop Type', key: 'shopType', transformer: 'title' },
    { name: 'Dicipta Pada', key: 'createdAt', transformer: 'date' },
    { name: 'Dikemaskini Pada', key: 'updatedAt', transformer: 'date' }
  ];

  modalIsOpen: boolean = false;
  modalFormTitle: string = '';
  modalSubmitLabel: string = '';
  modalFormMode: string = '';
  modalRecord: Shop | undefined;

  search: string = '';
  search$ = new Subject<string>();

  constructor(
    private shopService: ShopService,
    private toastService: ToastService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    const searchChanges = this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.table.loadData());

    this.destroyRef.onDestroy(() => {
      searchChanges.unsubscribe();
    })
  }

  @ViewChild(ShopDialog) modal!: ShopDialog;
  @ViewChild(Table) table!: Table;

  openAddModal() {
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
    return this.shopService.getShop(page, size, this.search);
  }
}
