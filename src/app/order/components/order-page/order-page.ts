import { Component } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";

@Component({
  selector: 'app-order-page',
  imports: [AdminLayout],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css'
})
export class OrderPage {
  titlePage: string = 'Order';

}
