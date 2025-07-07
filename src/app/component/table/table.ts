import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../common/pagination.model';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../common/table_column.model';

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
  totalPages = 1;
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
      this.data = res.content;
      this.totalPages = res.totalPages;
    });
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadData();
    }
  }

  onPageSizeChange() {
    this.page = 0; // Reset to first page
    this.loadData();
  }


}
