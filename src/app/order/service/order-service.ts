import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../common/pagination.model';
import { Order, ResponseOrderBooking, ResponseOrderInventory } from '../model/order-model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiRoute = environment.apiUrl + '/order';

  constructor(private http: HttpClient) {}

  getOrder(page = 0, size = 20, shopId: string, search: string) : Observable<PageResponse<Order>> {
    return this.http.get<PageResponse<Order>>(`${this.apiRoute}?page=${page}&size=${size}&shopId=${shopId}&search=${search}`);
  }

  getOrderBooking(orderId: string) {
    return this.http.get<ResponseOrderBooking>(`${this.apiRoute}/${orderId}/booking`);
  }

  getOrderInventory(orderId: string) {
    return this.http.get<ResponseOrderInventory>(`${this.apiRoute}/${orderId}/inventory`);
  }
  
}
