import { Component, DestroyRef, ViewChild } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";
import { TableColumn } from '../../../common/table_column.model';
import { Catalogue } from '../../../catalogue/model/catalogue-modal';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { ToastService } from '../../../common/services/toast-service';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { Table } from '../../../common/components/table/table';
import { FormsModule } from '@angular/forms';
import { PageResponse } from '../../../common/pagination.model';
import { OrderService } from '../../service/order-service';
import { Order } from '../../model/order-model';

@Component({
  selector: 'app-order-page',
  imports: [AdminLayout, FormsModule, Table],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css'
})
export class OrderPage {
  titlePage: string = 'Order';
  columns: TableColumn[] = [
    { name: 'No Order', key: 'orderNumber' },
    { name: 'Status', key: 'status' },
    { name: 'Kuantiti', key: 'quantity' },
    { name: 'Jumlah Bayaran', key: 'totalAmount' },
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

  @ViewChild(Table) table!: Table;

  shopNavigatorService!:ShopNavigatorService;

  constructor(
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    shopNavigatorService: ShopNavigatorService,
    private orderService: OrderService
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
    this.modalSubmitLabel = 'Cipta';
    this.modalFormMode = 'CREATE';
    this.modalIsOpen = true;
  }

  openEditModal(data: Catalogue) {
    this.modalFormTitle = 'Kemaskini Katalog';
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

  fetchProduct(page: number, size: number): Observable<PageResponse<Order>> {
    return this.orderService.getOrder(page, size, this.shopNavigatorService.shopId, this.search);
  }

}
