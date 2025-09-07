import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../table_column.model';
import { PageResponse } from '../../pagination.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  page = 0;
  pageSize = 5;
  totalPage = 1;
  data: any[] = [];

  @Input() columns: TableColumn[] = [];
  @Input() fetchDataFn!: (page: number, size: number) => Observable<PageResponse<any>>;

  @Output() rowClicked = new EventEmitter<any>();

  ngOnInit() {
    this.loadData();
  }

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }

  loadData() {
    this.fetchDataFn(this.page, this.pageSize).subscribe((res) => {
      this.data = res.data;
      this.totalPage = res.totalPage;
    });
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  nextPage() {
    if (this.page + 1 < this.totalPage) {
      this.page++;
      this.loadData();
    }
  }

  onPageSizeChange() {
    this.page = 0; // Reset to first page
    this.loadData();
  }


}
