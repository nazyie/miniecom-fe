import { Component } from '@angular/core';
import { AdminLayout } from '../../../common/components/admin-layout/admin-layout';
import { DynamicEchart } from "../../../common/components/dynamic-echart/dynamic-echart";

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [AdminLayout, DynamicEchart],
  templateUrl: './sales-page.html',
  styleUrls: ['./sales-page.css'],
})
export class SalesPage {
  titlePage = 'Sales';

}
