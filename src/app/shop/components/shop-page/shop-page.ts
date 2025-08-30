import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ShopDialog } from '../shop-dialog/shop-dialog';
import { BottomNavigationBar } from '../../../component/bottom-navigation-bar/bottom-navigation-bar';
import { Table } from '../../../component/table/table';
import { ShopService } from '../../services/shop-service';
import { NewShop, Shop } from '../../model/shop.model';
import { PageResponse } from '../../../common/pagination.model';
import { TableColumn } from '../../../common/table_column.model';
import { Header } from "../../../common/components/header/header";

@Component({
  selector: 'app-shop-page',
  imports: [
    BottomNavigationBar,
    ShopDialog,
    FormsModule,
    Header
],
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.css'
})
export class ShopPage {
  columns: TableColumn[] = [
    { name: 'Shop Name', key: 'name' },
    { name: 'Slug', key: 'slug' },
    { name: 'Created At', key: 'createdAt', transformer: 'date' }
  ];

  constructor(private shopService: ShopService) { }

  @ViewChild(ShopDialog) modal!: ShopDialog;
  @ViewChild(Table) table!: Table;

  openAddShopModal() {
    this.modal.formTitle = 'Add Shop';
    this.modal.submitLabel = 'Create';
    this.modal.formData = NewShop;
    this.modal.formMode = 'CREATE';
    this.modal.open();
  }

  openEditModal(data: Shop) {
    this.modal.formTitle = 'Update Shop';
    this.modal.submitLabel = 'Update';
    this.modal.formData = data;
    this.modal.formMode = 'EDIT';
    this.modal.open();
  }

  onFormSubmit(data: any) {
    switch (data.formMode) {
      case 'CREATE':
        this.shopService.createShop(data.formData).subscribe({
          next: () => {
            this.modal.close();
            this.table.loadData();
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

      case 'UPDATE':
        this.shopService.updateShop(data.formData).subscribe({
          next: () => {
            this.modal.close();
            this.table.loadData();
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

      case 'DELETE':
        this.shopService.deleteShop(data.id).subscribe({
          next: () => {
            this.modal.close();
            this.table.loadData();
          },
          error: (err) => {
            console.error('Error creating shop:', err);
          }
        });
        break;

    }

  }

  fetchShops(page: number, size: number): Observable<PageResponse<Shop>> {
    return this.shopService.getShop(page, size);
  }
}
