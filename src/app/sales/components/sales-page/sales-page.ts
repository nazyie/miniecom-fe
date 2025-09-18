import { Component } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";

@Component({
  selector: 'app-sales-page',
  imports: [AdminLayout],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.css'
})
export class SalesPage {
  titlePage: string = 'Sales'

}
