import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../common/pagination.model';
import { Shop } from './shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:8080/api/shop';

  constructor(private http: HttpClient) { }

  getShop(page = 0, size = 20): Observable<PageResponse<Shop>> {
    return this.http.get<PageResponse<Shop>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  createShop(shop: Shop): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, shop);
  }

  updateShop(shop: Shop): Observable<Shop> {
    return this.http.patch<Shop>(this.apiUrl, shop);
  }

  deleteShop(shopId: string): Observable<Shop> {
    return this.http.delete<Shop>(this.apiUrl + '/' + shopId);
  }

}
